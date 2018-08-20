const {ccclass, property} = cc._decorator;

@ccclass
export default class PageViewControl extends cc.Component {

    @property(cc.Float) scrolltime: number = 1;

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}

    // start () {

    // }

    // update (dt) {}
    Clickbutton(event, customEventData)
    {
        this.node.getComponent(cc.PageView).scrollToPage(parseInt(customEventData),this.scrolltime);
    }
}
