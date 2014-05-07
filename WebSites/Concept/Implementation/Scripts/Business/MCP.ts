/// <reference path="../../../scripts/definitions/jquery.d.ts" />

module Dashboard.MCP {
	class Main {
        controls: Control[];
	    CreateItem(item: any, data: any) : void {
	        if (!this.SetData(item, data))
				this.controls.push(new Control(item, data));
    	}
        GetData(item: any) : any {
            var found = $.grep(this.controls, function(singleItem) {
                return singleItem.item === item;
            });
            if (found.length == 1)
                return found[0].data;
            return null;
        }
        SetData(item: any, data: any) : bool {
            var found = $.grep(this.controls, function(singleItem) {
                return singleItem.item === item;
            });
            if (found.length == 1) // Just set the data
                found[0].data = data;

            return found.length == 1;
        }
    }
	class Control {
	    constructor(public item: any, public data: any){
	    }
	}
}
