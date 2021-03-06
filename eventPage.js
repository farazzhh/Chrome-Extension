var contextMenuItem = {
  id: "spendMoney",
  title: "SpendMoney",
  contexts: ["selection"],
};

chrome.contextMenus.create(contextMenuItem);

function isInt(value) {
  return (
    !isNaN(value) &&
    parseInt(Number(value)) == value &&
    !isNaN(parseInt(value, 10))
  );
}

chrome.contextMenus.onClicked.addListener(function (clickData) {
  console.log("test");
  if (clickData.menuItemId == "spendMoney" && clickData.selectionText) {
    if (isInt(clickData.selectionText)) {
      chrome.storage.sync.get(["total", "limit"], function (budget) {
        var newTotal = 0;
        if (budget.total) {
          newTotal += parseInt(budget.total);
        }
       newTotal += parseInt(clickData.selectionText);
       chrome.storage.sync.set({ total: newTotal }, function () {
         if (newTotal >= budget.limit) {
           var notifOptions = {
             type: "basic",
             iconUrl: "icon128.png",
             title: "Limit reached!",
             message: "Uh oh, look's like you've reached your alloted limit.",
           };
           chrome.notifications.create("limitNotif", notifOptions);
         }
       });
      });
    }
  }
});
