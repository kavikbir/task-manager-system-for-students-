# Google Apps Script Setup Guide

To finish your **Team Task Tracker**, follow these steps to connect your Google Sheet.

### 1. Create your Sheet
Create a Google Sheet with a tab named `Tasks` and another named `Members`.

**Tasks tab columns:**
A: Task ID, B: Task Name, C: Type, D: Assigned To, E: Planned Date, F: Completion Date, G: Status

**Members tab columns:**
A: Name, B: Weekly Score, C: Feedback

### 2. Add the Script
In your Google Sheet, go to **Extensions > Apps Script** and paste the code below.

```javascript
/**
 * TEAM TASK TRACKER - BACKEND SCRIPT V3 (Robust Version)
 */

function getSheet(name) {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName(name);
  if (sheet) return sheet;
  
  // Case-insensitive fallback
  var sheets = ss.getSheets();
  for (var i = 0; i < sheets.length; i++) {
    if (sheets[i].getName().toLowerCase() === name.toLowerCase()) return sheets[i];
  }
  return null;
}

function doGet(e) {
  try {
    var action = e.parameter.action;
    var taskSheet = getSheet('Tasks');
    if (!taskSheet) throw new Error("Could not find 'Tasks' sheet. Please name your tab 'Tasks'.");
    
    if (action === 'getTasks') {
      var member = (e.parameter.member || "").toString().trim().toLowerCase();
      var data = taskSheet.getDataRange().getValues();
      var tasks = [];
      
      for (var i = 1; i < data.length; i++) {
        var assignedTo = (data[i][3] || "").toString().trim().toLowerCase();
        if (assignedTo === member) { 
          var rawStatus = (data[i][6] || "").toString().trim();
          var status = (rawStatus === "Done" || rawStatus === "Completed" || rawStatus === "Finished") ? "Done" : "Pending";
          
          tasks.push({
            id: data[i][0].toString(),
            name: data[i][1] || "Untitled Task",
            type: data[i][2] || "One-time",
            assignedTo: data[i][3],
            plannedDate: data[i][4],
            status: status
          });
        }
      }
      return createJsonResponse({ success: true, tasks: tasks });
    }
    
    if (action === 'getMembers') {
      var memberSheet = getSheet('Members');
      if (!memberSheet) throw new Error("Could not find 'Members' sheet.");
      
      var data = memberSheet.getDataRange().getValues();
      var members = [];
      for (var i = 1; i < data.length; i++) {
        if (data[i][0]) { 
          members.push({ 
            name: data[i][0], 
            weeklyScore: data[i][1] || 0, 
            feedback: data[i][2] || "" 
          });
        }
      }
      return createJsonResponse({ success: true, members: members });
    }

    if (action === 'getAdminSummary') {
      var data = taskSheet.getDataRange().getValues();
      var summary = {};
      for (var i = 1; i < data.length; i++) {
        var member = data[i][3];
        if (!member) continue;
        var rawStatus = (data[i][6] || "").toString().trim();
        var status = (rawStatus === "Done" || rawStatus === "Completed") ? "Done" : "Pending";
        if (!summary[member]) summary[member] = { pending: 0, completed: 0 };
        if (status === 'Pending') summary[member].pending++;
        else summary[member].completed++;
      }
      return createJsonResponse({ success: true, summary: summary });
    }
    
    return createJsonResponse({ success: false, error: "Invalid action" });
  } catch (err) {
    return createJsonResponse({ success: false, error: err.message });
  }
}

function doPost(e) {
  try {
    if (!e.postData || !e.postData.contents) throw new Error("No payload found.");
    var payload = JSON.parse(e.postData.contents);
    
    if (payload.action === 'updateTask') {
      var taskSheet = getSheet('Tasks');
      var data = taskSheet.getDataRange().getValues();
      for (var i = 1; i < data.length; i++) {
        if (data[i][0].toString() === payload.taskId.toString()) {
          var plannedDate = new Date(data[i][4]);
          var completionDate = new Date();
          var isLate = completionDate > plannedDate;
          taskSheet.getRange(i + 1, 6).setValue(completionDate); 
          taskSheet.getRange(i + 1, 7).setValue("Done"); 
          updateMemberScore(data[i][3], isLate ? 5 : 10, isLate ? "Completed late" : "Completed on time");
          return createJsonResponse({ success: true });
        }
      }
    }

    if (payload.action === 'assignTask') {
      var taskSheet = getSheet('Tasks');
      var taskId = "T-" + new Date().getTime().toString().slice(-6);
      taskSheet.appendRow([taskId, payload.name || "New Task", payload.type || "One-time", payload.assignedTo, payload.plannedDate, "", "Pending"]);
      return createJsonResponse({ success: true });
    }

    if (payload.action === 'resetScores') {
      var memberSheet = getSheet('Members');
      var lastRow = memberSheet.getLastRow();
      if (lastRow > 1) {
        memberSheet.getRange(2, 2, lastRow - 1, 1).setValue(0);
        memberSheet.getRange(2, 3, lastRow - 1, 1).setValue("Score reset for new week");
      }
      return createJsonResponse({ success: true });
    }

    return createJsonResponse({ success: false, error: "Invalid action" });
  } catch (err) {
    return createJsonResponse({ success: false, error: err.message });
  }
}

function updateMemberScore(name, points, reason) {
  var sheet = getSheet('Members');
  if (!sheet) return;
  var data = sheet.getDataRange().getValues();
  for (var i = 1; i < data.length; i++) {
    if (data[i][0].toString().trim().toLowerCase() === name.toString().trim().toLowerCase()) {
      var currentScore = parseInt(data[i][1]) || 0;
      sheet.getRange(i + 1, 2).setValue(currentScore + points);
      sheet.getRange(i + 1, 3).setValue(reason);
      break;
    }
  }
}

function createJsonResponse(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);
}
```

### 3. Deploy
1. Click **Deploy > New Deployment**.
2. Select **Web App**.
3. Set "Execute as" to **Me** and "Who has access" to **Anyone**.
4. Copy the **Web App URL**.

### 4. Connect to App
Open the `.env` file in your project and set:
`VITE_GAS_WEB_APP_URL` = `YOUR_COPIED_URL`
