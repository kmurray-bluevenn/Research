module PubSubjs{
    interface Base{
        subscribe (message:any, func:Function);
        publish();
        publish(message: any);
        publish(message: any, data: any);
        publish(message: any, data: any, sync: any);
        publish(message: any, data: any, sync: any, immediateExceptions: any);
    }
}

declare var PubSub : PubSubjs.Base