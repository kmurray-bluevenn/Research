var Dashboard;
(function (Dashboard) {
    (function (MCP) {
        var Main = (function () {
            function Main() { }
            Main.prototype.CreateItem = function (item, data) {
                if(!this.SetData(item, data)) {
                    this.controls.push(new Control(item, data));
                }
            };
            Main.prototype.GetData = function (item) {
                var found = $.grep(this.controls, function (singleItem) {
                    return singleItem.item === item;
                });
                if(found.length == 1) {
                    return found[0].data;
                }
                return null;
            };
            Main.prototype.SetData = function (item, data) {
                var found = $.grep(this.controls, function (singleItem) {
                    return singleItem.item === item;
                });
                if(found.length == 1) {
                    found[0].data = data;
                }
                return found.length == 1;
            };
            return Main;
        })();        
        var Control = (function () {
            function Control(item, data) {
                this.item = item;
                this.data = data;
            }
            return Control;
        })();        
    })(Dashboard.MCP || (Dashboard.MCP = {}));
    var MCP = Dashboard.MCP;
})(Dashboard || (Dashboard = {}));
