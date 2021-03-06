page = doc.currentPage()
artboard = page.currentArtboard()
canvas = artboard || page

function makeRect (parent, width, height, x, y) {
  layer = parent.addLayerOfType("rectangle")

  layer.frame().width = width
  layer.frame().height = height
  layer.frame().x = x || 0
  layer.frame().y = y || 0

  layer.style().borders().addNewStylePart()
  layer.style().border().position = 0
  layer.style().border().thickness = 1
  layer.style().border().color = [MSColor colorWithHex:"979797" alpha:1.0]

  layer.style().fills().addNewStylePart()
  layer.style().fill().color = [MSColor colorWithHex:"FFFFFF" alpha:0.0]
  return layer
}

function makePath (parent, path, name) {
  msPath = BCBezierPath.bezierPathWithNSBezierPath(bzPath)
  layer = MSShapeGroup.shapeWithBezierPath(msPath)
  layer.name = name || parent.name()
  layer.style().borders().addNewStylePart()
  layer.style().border().position = 0
  layer.style().border().thickness = 1
  layer.style().border().color = [MSColor colorWithHex:"979797" alpha:1.0]
  layer.constrainProportions = true

  return parent.addLayer(layer)
}

function goldenRect (parent, rect) {
  rect = makeRect(parent, rect.w, rect.w / 1.618, rect.x, rect.y)
  rect.name = "Golden Rectangle"
  rect.constrainProportions = true
  return rect
}

function makeGrid (parent, rect, radio) {
  w = rect.w
  h = rect.h
  x = rect.x
  y = rect.y

  vSection = w * radio
  hSection = h * radio

  bzPath = NSBezierPath.new()

  bzPath.appendBezierPathWithRect(NSMakeRect(x, y, w, h))

  bzPath.moveToPoint(NSMakePoint(x + vSection, y))
  bzPath.lineToPoint(NSMakePoint(x + vSection, y + h))

  bzPath.moveToPoint(NSMakePoint(w - vSection + x, y))
  bzPath.lineToPoint(NSMakePoint(w - vSection + x, y + h))

  bzPath.moveToPoint(NSMakePoint(x, y + hSection))
  bzPath.lineToPoint(NSMakePoint(x + w, y + hSection))

  bzPath.moveToPoint(NSMakePoint(x, y + h - hSection))
  bzPath.lineToPoint(NSMakePoint(x + w, y + h - hSection))

  return makePath(parent, bzPath)
}

function addGroup(name, drawingAction) {
  group = canvas.addLayerOfType("group") 
  group.name = name
  group.ignoreNextClickThrough = true
  group.constrainProportions = true
  drawingAction.call(this, group)
  group.resizeRoot()
  return group
}

function loopSelectedLayers(action) {
  var loop = selection.objectEnumerator()
  if (selection.count() == 0) {
    action.call(this, {
      x: 0,
      y: 0,
      w: 600,
      h: 600 / 1.618
    })
  }
  while (sel = loop.nextObject()) {
    isArtBoard = sel.class() == MSArtboardGroup
    action.call(this, {
      x: isArtBoard ? 0 : sel.frame().x(),
      y: isArtBoard ? 0 : sel.frame().y(),
      w: sel.frame().width(),
      h: sel.frame().height()
    })
  }
}
