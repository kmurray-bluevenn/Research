module dashboard.interfaces {
	export interface IWidgethandler {
        //This will draw the templates on to the screen
        Render(): void;

        // This will remove the item from the screen?
        // un-subscribe itself from the publish/subscribe model
        Dispose(): void;



        //Placeholders, These should
        _registerSubscriptions(): void;

        _unsubscribe(): void;
    }
}
