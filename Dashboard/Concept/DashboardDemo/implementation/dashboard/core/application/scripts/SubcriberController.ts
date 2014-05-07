/// <reference path="utils/logger.ts" />
/// <reference path="../../3rdParty/definitions/underscore.d.ts" />
/// <reference path="../../3rdParty/definitions/pubsub.d.ts" />

module dashboard {
    export class SubcriberController {
        private data;
        private tokens: any[];
        constructor () {
            this.tokens = [];
            this.data = { children: {} };
        }

        public Subcribe(datasetName: string, MethodToSubcribe: Function) {
            try {
                //TODO: Start the request for the dataset name;
                var token = PubSub.subscribe("car", MethodToSubcribe);
                this._registerDataSet(datasetName);
                this.tokens.push(token);
            }
            catch (e) {
                Logger.log(e.name + ": " + e.message);
            }
        }


        public Unsubcribe(token: any) {
            PubSub.unsubscribe(token);

        }

        private _registerDataSet(datasetName: string): void {
            var obj = this.data;
            datasetName.split(".").forEach(function (item) {
                if (!_.contains(Object.keys(obj.children), item)) {
                    obj.children[item] = { count: 1, children: {} }
                }
                else {
                    obj.children[item]["count"]++;
                }
                obj = obj.children[item];
            });
        }

        private _unregisterDataSet(datasetName: string):bool {
            var dataset = datasetName.split(".");
            var obj = this.data;
            dataset.forEach(function (item) {
                if (!_.contains(Object.keys(obj.children), item))
                    throw new Error("Key doesn't exist");
                obj = obj.children[item];
            });

            obj = this.data["children"];
            for (var i: number = 0, limit: number = dataset.length; i < limit; i++) {
                obj[dataset[i]]["count"]--;
                if (obj[dataset[i]]["count"] == 0) {
                    delete obj[dataset[i]];
                    //TODO: Kill data request for branch of the server
                    i = limit;
                }
                else {
                    obj = obj.children[dataset[i]];
                }
            }
            return true;
        }
    }
    dashboard["sub"] = new SubcriberController();
}