/** 用于控制形状的点击事件 */
import * as lib from '../lib/lib'
import FlyingShape from './FlyingShape'
import ClickEndControl from './ClickEnd'
import ShapeControl from './ShapeControl'
import ShapeManager from './ShapeManager'
// import touchInstance from "./touchInstance"
import { _kits } from '../../../libdts/kits';

const {ccclass, property} = cc._decorator;

@ccclass
export default class ClickShape extends cc.Component {
    //----- 编辑器属性 -----//
    /** 默认高分区域边长 */
    @property({tooltip:"高分区域边长",  type: cc.Integer }) highScoreWidth:number = 10;

    //----- 属性声明 -----//
    //飞行轨迹控制器
    private flyControl: FlyingShape = null;
    //形状外形控制器
    private shapeControl: ShapeControl = null;
    //形状管理单例
    private shapeManager: ShapeManager = null;
    //因为点击穿透和冒泡不能单独打开或关闭，导致点击2个以上形状是，触摸事件可能重复触发，因此加入点击锁
    private clickLock: boolean = false;
    //----- 生命周期 -----//

    onLoad () {
        this.shapeManager = ShapeManager.getinstance();
        this.flyControl = this.node.getComponent(FlyingShape);
        this.shapeControl = this.node.getComponent(ShapeControl);
        this.flyControl.ShowNode.on(cc.Node.EventType.TOUCH_START,(event:cc.Event.EventTouch)=>{
            this.ClickSatr(event);
        });
        // this.node.on('rotation-changed', this._onNodeRotationChanged, this);
        // this.node.on(cc.Node.EventType.TOUCH_END,(event:cc.Event.EventTouch)=>{

        // },this);

        // this.node.on(cc.Node.EventType.TOUCH_CANCEL,(event:cc.Event.EventTouch)=>{

        // },this);
    }

    //  start() {}

    // update (dt) {}
    onDestroy(){
        if(this.flyControl.ShowNode)
        {
            this.flyControl.ShowNode.off(cc.Node.EventType.TOUCH_START,(event:cc.Event.EventTouch)=>{
                this.ClickSatr(event);
            });
        }
    }
    // onDestroy(){
    //     this.flyControl.ShowNode.off(cc.Node.EventType.TOUCH_START,(event:cc.Event.EventTouch)=>{
    //         this.ClickSatr(event);
    //     });
    //     // this.node.off('rotation-changed', this._onNodeRotationChanged, this);
    //     // this.node.off(cc.Node.EventType.TOUCH_END,(event:cc.Event.EventTouch)=>{

    //     // },this);

    //     // this.node.off(cc.Node.EventType.TOUCH_CANCEL,(event:cc.Event.EventTouch)=>{

    //     // },this);
    // }
    
    //----- 私有方法 -----//
    // private _onNodeRotationChanged(){
    //     // this.node.getComponent(cc.MotionStreak)._motionStreak.rotation = -this.node.rotation;
    //     // this.node.getComponent(cc.MotionStreak)._root.position = new cc.Vec2(0,0);
    // }

    private ClickSatr(event:cc.Event.EventTouch){
        // if(touchInstance.getinstance().getCanMove())
        // {
        //     return;
        // }
        //event.stopPropagation();吞没事件不向上冒泡，也不进行穿透
        //将触摸坐标转化为以node中心为原点的坐标
        if(this.clickLock)
        {
            return;
        }
        let touchx = event.getLocation().x - this.node.convertToWorldSpaceAR(cc.Vec2.ZERO).x;
        let touchy = event.getLocation().y - this.node.convertToWorldSpaceAR(cc.Vec2.ZERO).y;
        // console.log("getLocationx = " + event.getLocation().x + "  getLocationy = " + event.getLocation().y);
        // console.log("this.node.x = " + this.node.convertToWorldSpaceAR(cc.Vec2.ZERO).x + "  this.node.y = " + this.node.convertToWorldSpaceAR(cc.Vec2.ZERO).y);
        // console.log("x = " + touchx + "  y =" + touchy);
        if(!this.shapeControl.getIsClickShape(touchx,touchy))
        {
            return;
        }
        if(Math.abs(touchx) < this.highScoreWidth / 2 * this.node.scaleX * this.flyControl.ShowNode.scaleX
        && Math.abs(touchy) < this.highScoreWidth / 2 * this.node.scaleY * this.flyControl.ShowNode.scaleY)
        {
            //console.log("high score");
            // let click:_kits.ClickControl.click = {
            //     score: score,
            //     node: this.node,
            // }
            let score: number = 100;
            if(this.shapeControl.isSpecial)
            {
                score = 0;
            }
            let shapInfo:_kits.ClickShape.ScoreInfo = {
                score: score,
                shape: this.shapeControl.gettype()[0],
                isSpecial: this.shapeControl.isSpecial,
            }
            this.shapeControl.destroyAni(true);
            lib.msgEvent.getinstance().emit(lib.msgConfig.clickStart,shapInfo);
        }
        else
        {
            //console.log("low score");
            // let click:_kits.ClickControl.click = {
            //     score: score,
            //     node: this.node,
            // }
            let score: number = 50;
            if(this.shapeControl.isSpecial)
            {
                score = 0;
            }
            let shapInfo:_kits.ClickShape.ScoreInfo = {
                score: score,
                shape: this.shapeControl.gettype()[0],
                isSpecial: this.shapeControl.isSpecial,
            }
            this.shapeControl.destroyAni(false);
            lib.msgEvent.getinstance().emit(lib.msgConfig.clickStart,shapInfo);
        }
        this.clickLock = true;
        this.shapeManager.delShape(this.node);
    }
}
