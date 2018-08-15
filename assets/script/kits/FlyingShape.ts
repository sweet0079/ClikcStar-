/** 用于控制形状的飞行轨迹 */
import * as lib from '../lib/lib';
import Dissipation from './Disspation';
import shapeControl from './ShapeControl';
import ShapeManager from './ShapeManager';
import BossTimeInstance from './BossTimeInstance';
import { _kits } from '../../../libdts/kits';

const {ccclass, property} = cc._decorator;

@ccclass
export default class FlyingShape extends cc.Component {
    //----- 编辑器属性 -----//
    /** 默认飞行轨迹 */
    @property({tooltip:"飞行轨迹",  type: lib.defConfig.Flightpath }) Flightpath = lib.defConfig.Flightpath.straight;
    /** 默认出生位置 */
    @property({tooltip:"出生位置",  type: lib.defConfig.shapebirthpos }) birthpos = lib.defConfig.shapebirthpos.left;
    /** 飞行速度 */
    @property({tooltip:"飞行速度",type: cc.Float }) Speed:number = 100;
    /** 默认入射角 */
    @property({tooltip:"入射角", type: cc.Integer }) Angle:number = 0;
    /** 默认长曲线模式加速度 */
    @property({tooltip:"长曲线模式角变化速度，单位度每秒,适用于长曲线", type: cc.Integer }) deltangle:number = 10;
    /** 默认螺旋线速度 */
    @property({tooltip:"螺旋线速度，用于螺旋模式",  type: cc.Integer }) screwspeed:number = 200;
    /** 默认螺旋角速度 */
    @property({tooltip:"螺旋角速度，用于螺旋模式",  type: cc.Integer }) screwAngleSpeed:number = 180;
    /** 默认转向模式转向距离 */
    @property({tooltip:"转向模式开始转向的距离",  type: cc.Integer }) TurnThreshold:number = 500;
    /** 默认转向角 */
    @property({tooltip:"转向模式下转向的角度", type: cc.Integer }) TurnAngle:number = 0;
    /** 默认显示节点 */
    @property({tooltip:"显示节点", type: cc.Node }) ShowNode:cc.Node = null;
    //----- 静态属性 -----//
    /** 飞行轨迹枚举 */
    static readonly Flightpath = lib.defConfig.Flightpath;
    //----- 属性声明 -----//
    //螺旋模式初始螺旋角度
    private screwAngle:number = 90;
    //长曲线模式以改变角度
    private subChangeAngle:number = 0;
    //累计移动距离
    private subMoveDistence:number = 0;
    //是否已经转向
    private haveturn:boolean = false;
    //下落速度
    private dropSpeed:number = 0;
    //停止标识
    private stopFlag:boolean = false;
    //消散组件
    private dissControl:Dissipation = null;

    private _shapeControl:shapeControl = null;
    
    //----- 生命周期 -----//
    // onLoad () {}

    start () {
        //根据出生位置改变飞行轨迹部分参数
        switch(this.birthpos)
        {
            case lib.defConfig.shapebirthpos.right:
                this.Speed = -this.Speed;
                this.Angle = -this.Angle;
                break;
            case lib.defConfig.shapebirthpos.top:
                this.Angle -= 90;
                break;
            case lib.defConfig.shapebirthpos.bottom:
                this.Angle += 90;
                break;
            default:
                break;
        }
        this._shapeControl = this.node.getComponent(shapeControl);
        if(this._shapeControl)
        {
            if(!this._shapeControl.isSpecial)
            {
                this.ShowNode.rotation = -this.Angle;
            }
        }
        this.dissControl = this.node.getComponent(Dissipation);
    }

    update (dt) {
        if(this.stopFlag)
        {
            return;
        }
        if(BossTimeInstance.getinstance().getisBossTime() && this._shapeControl.isSpecial == false)
        {
            this.flyToPoint(dt,BossTimeInstance.getinstance().getbossPos());
            return;
        }
        if(ShapeManager.getinstance().getFrozen())
        {
            dt *= 0.5;
        }
        //如果已经触发离开屏幕方法
        if(this.dissControl.getLeave()
        && !(this.dissControl.type == lib.defConfig.dissipate.none
        || this.dissControl.type == lib.defConfig.dissipate.rebound))
        {
            if(this.dissControl.type == lib.defConfig.dissipate.drop)
            {
                this._drop(dt);
            }
            //暂时这么写，让还没实现的消散特效直接飞出屏幕
            else
            {
                this.node.x += this.Speed * dt * Math.cos(this.Angle * lib.defConfig.coefficient);
                this.node.y += this.Speed * dt * Math.sin(this.Angle * lib.defConfig.coefficient);
                if(this.dissControl.getAdmission())
                {
                    this.subMoveDistence += Math.abs(this.Speed) * dt;
                    switch(this.Flightpath)
                    {
                        case lib.defConfig.Flightpath.straight:
                            this.flystraight(dt);
                            break;
                        // case lib.defConfig.Flightpath.curve:
                        //     this.flycurve(dt);
                        //     break;
                        // case lib.defConfig.Flightpath.screw:
                        //     this.flyscrew(dt);
                        //     break;
                        // case lib.defConfig.Flightpath.turn:
                        //     this.flyturn(dt);
                        //     break;
                        // case lib.defConfig.Flightpath.back:
                        //     this.flyback(dt);
                        //     break;
                        default:
                            break;
                    }
                }

            }
        }
        //还未触发离开屏幕方法，走正常的飞行轨迹
        else
        {
            // //如果已经整体进入点击区域
            // if(this.dissControl.getAdmission())
            // {
            this.node.x += this.Speed * dt * Math.cos(this.Angle * lib.defConfig.coefficient);
            this.node.y += this.Speed * dt * Math.sin(this.Angle * lib.defConfig.coefficient);
            switch(this.Flightpath)
            {
                case lib.defConfig.Flightpath.straight:
                    this.flystraight(dt);
                    break;
                // case lib.defConfig.Flightpath.curve:
                //     this.flycurve(dt);
                //     break;
                // case lib.defConfig.Flightpath.screw:
                //     this.flyscrew(dt);
                //     break;
                // case lib.defConfig.Flightpath.turn:
                //     this.flyturn(dt);
                //     break;
                // case lib.defConfig.Flightpath.back:
                //     this.flyback(dt);
                //     break;
                default:
                    break;
            }
            if(this.dissControl.getAdmission())
            {
                this.subMoveDistence += Math.abs(this.Speed) * dt;
            }
        }
    }
    //----- 公有方法 -----//
    //设置停止标识符
    setStopFlag(Flag:boolean)
    {
        this.stopFlag = Flag;
    }
    //停止移动
    stopMove(){
        this.Speed = 0;
        this.Flightpath = lib.defConfig.Flightpath.straight;
    }

    //取得目前移动的总路程
    getsubMoveDis(){
        return this.subMoveDistence;
    }

    //增加角度
    addAngle(angle: number){
        this.Angle += angle;
        this.ShowNode.rotation = -this.Angle;
    }
    
    //设置角度
    setAngle(angle: number){
        this.Angle = angle;
        //this.ShowNode.rotation = -this.Angle;
    }

    //获得当前显示节点的旋转度数
    getRotation(){
        return this.ShowNode.rotation;
    }

    //取得所有飞行轨迹参数
    getparameter(){
        let flypathparameter: _kits.FlyingShape.parameters = {
            Flightpath:this.Flightpath,
            birthpos:this.birthpos,
            Speed:this.Speed,
            Angle:this.Angle,
            deltangle:this.deltangle,
            screwspeed:this.screwspeed,
            screwAngleSpeed:this.screwAngleSpeed,
            TurnThreshold:this.TurnThreshold,
            TurnAngle:this.TurnAngle,
        }
        return flypathparameter;
    }

    //设置所有飞行轨迹参数
    setparameter(parameter: _kits.FlyingShape.parameters){
        this.Flightpath = parameter.Flightpath;
        //this.birthpos = parameter.birthpos;
        this.Speed = parameter.Speed;
        this.Angle = parameter.Angle;
        this.deltangle = parameter.deltangle;
        this.screwspeed = parameter.screwspeed;
        this.screwAngleSpeed = parameter.screwAngleSpeed;
        this.TurnThreshold = parameter.TurnThreshold;
        this.TurnAngle = parameter.TurnAngle;
    }
    //----- 私有方法 -----//
    //飞向某个点
    private flyToPoint(dt,pos:cc.Vec2){
        let angle = Math.atan((this.node.y - pos.y) / (this.node.x - pos.x));
        if(this.node.x < pos.x)
        {
            this.node.x += Math.abs(this.Speed) * dt * Math.cos(angle) * 2;
            this.node.y += Math.abs(this.Speed) * dt * Math.sin(angle) * 2;
        }
        else
        {
            this.node.x -= Math.abs(this.Speed) * dt * Math.cos(angle) * 2;
            this.node.y -= Math.abs(this.Speed) * dt * Math.sin(angle) * 2;
        }
    }

    //直线飞行方法
    private flystraight(dt){

    }

    //曲线飞行方法
    private flycurve(dt){
        if(this.subChangeAngle >= 90
        || this.subChangeAngle <= -90)
        {
            return;
        }
        // this.Angle -= this.deltangle * dt;
        // this.ShowNode.rotation = -this.Angle;
        let angle = this.Angle - this.deltangle * dt;
        this.setAngle(angle);
        this.subChangeAngle += this.deltangle * dt;
    }

    //螺旋飞行方法
    private flyscrew(dt){
        this.node.x -= this.screwspeed * Math.sin(this.screwAngle * lib.defConfig.coefficient) * dt * Math.sin(this.Angle * lib.defConfig.coefficient);
        this.node.y += this.screwspeed * Math.sin(this.screwAngle * lib.defConfig.coefficient) * dt * Math.cos(this.Angle * lib.defConfig.coefficient);
        // this.screwAngle += this.screwAngleSpeed * dt;
        // this.node.scale = (0.9 + 0.1 * Math.sin(this.screwAngle * lib.defConfig.coefficient));
        //原scale大小
        let deforescale = (0.9 + 0.1 * Math.sin(this.screwAngle * lib.defConfig.coefficient));
        this.screwAngle += this.screwAngleSpeed * dt;
        //this.node.scale = (0.9 + 0.1 * Math.sin(this.screwAngle * lib.defConfig.coefficient));
        //this.node.scale = (0.9 + 0.1 * Math.sin(this.screwAngle * lib.defConfig.coefficient));
        //现在的scale大小
        let afterscale = (0.9 + 0.1 * Math.sin(this.screwAngle * lib.defConfig.coefficient));
        //scale大小差
        let scaledelt = afterscale - deforescale;
        this.node.scale *= (scaledelt + 1);
    }
    
    //转向飞行方法
    private flyturn(dt){
        if(this.haveturn)
        {
            return;
        }
        if(this.subMoveDistence > this.TurnThreshold)
        {
            this.haveturn = true;
            this.Angle += this.TurnAngle;
            let action = cc.rotateBy(0.1,-this.TurnAngle);
            this.ShowNode.runAction(action);
        }
    }
    
    //回退飞行方法
    private flyback(dt){
        if(this.haveturn)
        {
            return;
        }
        if(this.subMoveDistence > this.TurnThreshold)
        {
            this.haveturn = true;
            this.Angle += 180;
            let action = cc.rotateBy(0.1,-180);
            this.ShowNode.runAction(action);
        }
    }

    //消散下落方法
    private _drop(dt){
        this.dropSpeed += 9.8 * dt;
        this.node.y -= this.dropSpeed;
    }
}
