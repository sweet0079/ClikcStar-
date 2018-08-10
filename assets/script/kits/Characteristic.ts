/** 用于控制形状的特性 */
import * as lib from '../lib/lib'
import FlyingShape from './FlyingShape'
import Dissipation from './Disspation'
import ShapeControl from './ShapeControl'
import ShapeManager from './ShapeManager'

const {ccclass, property} = cc._decorator;

@ccclass
export default class Characteristic extends cc.Component {
    //----- 编辑器属性 -----//
    /** 默认特性类型 */
    @property({tooltip:"特性类型",  type: lib.defConfig.character }) type = lib.defConfig.character.none;
    /** 默认大小变化时的变化系数 */
    @property({tooltip:"大小变化时的变化系数", type: cc.Float }) ScaleMultiple:number = 0.5;
    /** 默认速度变化时的变化系数 */
    @property({tooltip:"大小速度时的变化系数", type: cc.Float }) SpeedMultiple:number = 0.5;
    /** 默认旋转速度,度每秒 */
    @property({tooltip:"旋转速度", type: cc.Integer }) rotateSpeed:number = 180;
    /** 默认分裂变化时分裂开始的距离 */
    @property({tooltip:"分裂变化时分裂开始的距离", type: cc.Integer }) divisionDistance:number = 500;
    /** 默认翻转频率（ */
    @property({tooltip:"翻转频率（多少秒翻转一次）", type: cc.Float }) flipFrequency:number = 1;
    /** 默认渐隐频率（ */
    @property({tooltip:"多少秒渐隐一次", type: cc.Float }) fadeFrequency:number = 1;
    /** 默认闪烁频率（ */
    @property({tooltip:"多少秒闪烁一次", type: cc.Float }) blinkFrequency:number = 1;
    /** 形状的预制体 */
    @property(cc.Prefab) shapeprefeb: cc.Prefab = null;

    //----- 属性声明 -----//
    //飞行轨迹控制器
    private flyControl: FlyingShape = null;
    //消散控制器
    private dissControl: Dissipation = null;
    //目标速度
    private targetSpeed: number = 0;
    //加速度
    private acceleration: number = 0;
    //移动距离总和
    private subMoveDis: number = 0;
    //已经结束所有动作
    private havestop: boolean = false;
    //----- 生命周期 -----//
    // onLoad () {}

    start () {
        this.flyControl = this.node.getComponent(FlyingShape);
        this.dissControl = this.node.getComponent(Dissipation);
        switch(this.type)
        {
            case lib.defConfig.character.scale:
                this.scalechange();
                break;
            case lib.defConfig.character.speed:
                //记录目标速度，并计算出加速度，因为速度有正负，这里取速度的绝对值
                this.targetSpeed = Math.abs(this.node.getComponent(FlyingShape).Speed) * this.SpeedMultiple;
                this.acceleration = Math.abs(this.node.getComponent(FlyingShape).Speed - this.targetSpeed) / 1;
                break;
            case lib.defConfig.character.division:
                break;
            case lib.defConfig.character.rotate:
                this.rotatechange();
                break;
            // case lib.defConfig.character.flipping:
            //     this.flippingchange();
            //     break;
            case lib.defConfig.character.fadeout:
                this.fadeout();
                break;
            case lib.defConfig.character.fadeout:
                this.blink();
                break;
        }
    }
    
    update (dt) {
        if(!this.node.getComponent(Dissipation).getLeave())
        {
            if(this.type == lib.defConfig.character.speed)
            {
                this.speedchange(dt);
            }
            else if(this.type == lib.defConfig.character.division)
            {
                if(this.flyControl.getsubMoveDis() > this.divisionDistance)
                {
                    this.divisionchange();
                }
            }
        }
        else
        {
            //如果消散方式是坠落，当触发离开屏幕方法时，结束所有动作
            if(!this.havestop
                && this.node.getComponent(Dissipation).type == lib.defConfig.dissipate.drop)
            {
                this.flyControl.ShowNode.opacity = 255;
                this.node.runAction(cc.fadeIn(0.05));
                this.node.stopAllActions();
                this.flyControl.ShowNode.stopAllActions();
            }
        }
    }
    //----- 公有方法 -----//
    stopAct(){
        if(this.flyControl)
        {
            this.node.stopAllActions();
            this.flyControl.ShowNode.stopAllActions();
            this.flyControl.ShowNode.opacity = 255;
            this.node.runAction(cc.fadeIn(0.05));
            // this.flyControl.ShowNode.rotation = 0;
            this.node.getComponent(Dissipation).type = lib.defConfig.dissipate.none;
        }
    }

    //设置分裂距离
    setdivisionDistance(num:number){
        this.divisionDistance = num;
    }
    //----- 私有方法 -----//
    //改变大小
    private scalechange() {
        let action1 = cc.scaleBy(1,this.ScaleMultiple);
        let action2 = cc.scaleBy(1,1/this.ScaleMultiple);
        let seq = cc.sequence(action1,action2);
        let act = cc.repeatForever(seq);
        this.flyControl.ShowNode.runAction(act);
    }

    //速度变化
    private speedchange(dt) {
        //根据当前速度与目标速度的大小，改变速度
        if(Math.abs(this.flyControl.Speed) > this.targetSpeed)
        {
            if(this.flyControl.Speed > 0)
            {
                this.flyControl.Speed -= this.acceleration * dt;
            }
            else
            {
                this.flyControl.Speed += this.acceleration * dt;
            }
            if(Math.abs(this.flyControl.Speed) <= this.targetSpeed)
            {
                this.targetSpeed /= this.SpeedMultiple;
            }
        }
        else
        {
            if(this.flyControl.Speed > 0)
            {
                this.flyControl.Speed += this.acceleration * dt;
            }
            else
            {
                this.flyControl.Speed -= this.acceleration * dt;
            }
            if(Math.abs(this.flyControl.Speed) >= this.targetSpeed)
            {
                this.targetSpeed *= this.SpeedMultiple;
            }
        }
    }   

    //分裂变化
    private divisionchange(){
        let [type,color] = this.node.getComponent(ShapeControl).gettype();
        let shape1 = cc.instantiate(this.shapeprefeb);
        shape1.getComponent(FlyingShape).setparameter(this.flyControl.getparameter());
        shape1.getComponent(FlyingShape).addAngle(45);
        shape1.getComponent(Dissipation).setparameter(this.dissControl.getparameter());
        shape1.getComponent(ShapeControl).setcolor(color);
        shape1.getComponent(ShapeControl).setShape(type);
        shape1.position = this.node.position;
        shape1.scale = this.node.scale;
        shape1.parent = this.node.parent;
        let shape2 = cc.instantiate(this.shapeprefeb);
        shape2.getComponent(FlyingShape).setparameter(this.flyControl.getparameter());
        shape2.getComponent(FlyingShape).addAngle(-45);
        shape2.getComponent(Dissipation).setparameter(this.dissControl.getparameter());
        shape2.getComponent(ShapeControl).setcolor(color);
        shape2.getComponent(ShapeControl).setShape(type);
        shape2.position = this.node.position;
        shape2.scale = this.node.scale;
        shape2.parent = this.node.parent;
        ShapeManager.getinstance().addShape(shape1);
        ShapeManager.getinstance().addShape(shape2);
        ShapeManager.getinstance().delShape(this.node);
        this.node.destroy();
    }

    //旋转
    private rotatechange()
    {
        let action = cc.rotateBy(360 / this.rotateSpeed,360);
        let act = cc.repeatForever(action);
        this.flyControl.ShowNode.runAction(act);
    }

    //翻转
    private flippingchange(){
        const defscale = this.node.scale;
        let a1 = cc.skewTo(0.1, 0, 15);
        let a2 = cc.scaleTo(0.1, 0, defscale);
        let a3 = cc.callFunc(() => {
            this.node.skewY = -5;
        });
        let a4 = cc.scaleTo(0.1, defscale, defscale);
        let a5 = cc.skewTo(0.1, 0, 0);
        let action = cc.sequence(a1, a2, a3, a4, a5);
        let seq = cc.sequence(cc.delayTime(this.flipFrequency),action);
        let rep = cc.repeatForever(seq);
        this.flyControl.ShowNode.runAction(rep);
    }

    //渐隐
    private fadeout(){
        let fout = cc.fadeOut(this.fadeFrequency);
        let fin = cc.fadeIn(this.fadeFrequency);
        let seq = cc.sequence(fout,cc.delayTime(0.25),fin,cc.delayTime(0.25));
        let rep = cc.repeatForever(seq);
        this.node.runAction(rep);
    }

    //闪烁
    private blink(){
        let act = cc.blink(this.blinkFrequency,1);
        let rep = cc.repeatForever(act);
        this.node.runAction(rep);
    }
}
