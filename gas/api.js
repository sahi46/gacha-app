// Google Apps Script — ガチャAPIサーバー
// このファイルの中身を全部コピーしてGASエディタに貼り付けてください

var SHEET_GACHAS = 'gachas'
var SHEET_ITEMS = 'gacha_items'

function doGet(e) {
  try {
    var action = e.parameter.action

    if (action === 'getGacha') {
      var shareId = e.parameter.shareId
      var ss = SpreadsheetApp.getActiveSpreadsheet()

      var gachasSheet = ss.getSheetByName(SHEET_GACHAS)
      var gachasData = gachasSheet.getDataRange().getValues()
      // 行: [share_id, id, name, description, created_at]
      var gachaRow = null
      for (var i = 1; i < gachasData.length; i++) {
        if (gachasData[i][0] === shareId) { gachaRow = gachasData[i]; break }
      }
      if (!gachaRow) return jsonRes({ error: 'not found' })

      var gacha = {
        share_id: gachaRow[0],
        id: gachaRow[1],
        name: gachaRow[2],
        description: gachaRow[3] || null,
        created_at: gachaRow[4]
      }

      var itemsSheet = ss.getSheetByName(SHEET_ITEMS)
      var itemsData = itemsSheet.getDataRange().getValues()
      // 行: [id, gacha_id, name, weight, color, emoji, rarity_label]
      var items = []
      for (var j = 1; j < itemsData.length; j++) {
        if (itemsData[j][1] === gacha.id) {
          items.push({
            id: itemsData[j][0],
            gacha_id: itemsData[j][1],
            name: itemsData[j][2],
            weight: Number(itemsData[j][3]),
            color: itemsData[j][4],
            emoji: itemsData[j][5],
            rarity_label: itemsData[j][6]
          })
        }
      }

      return jsonRes({ gacha: gacha, items: items })
    }

    return jsonRes({ error: 'unknown action' })
  } catch (err) {
    return jsonRes({ error: err.message })
  }
}

function doPost(e) {
  try {
    var data = JSON.parse(e.postData.contents)
    var action = data.action

    if (action === 'createGacha') {
      var ss = SpreadsheetApp.getActiveSpreadsheet()
      var gachaId = Utilities.getUuid()
      var now = new Date().toISOString()

      var gachasSheet = ss.getSheetByName(SHEET_GACHAS)
      gachasSheet.appendRow([data.shareId, gachaId, data.name, data.description || '', now])

      var itemsSheet = ss.getSheetByName(SHEET_ITEMS)
      var items = data.items
      for (var i = 0; i < items.length; i++) {
        var item = items[i]
        var itemId = Utilities.getUuid()
        itemsSheet.appendRow([itemId, gachaId, item.name, item.weight, item.color, item.emoji, item.rarity_label])
      }

      return jsonRes({ success: true, shareId: data.shareId })
    }

    return jsonRes({ error: 'unknown action' })
  } catch (err) {
    return jsonRes({ error: err.message })
  }
}

function jsonRes(data) {
  var output = ContentService.createTextOutput(JSON.stringify(data))
  output.setMimeType(ContentService.MimeType.JSON)
  return output
}
