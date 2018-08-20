/** 控制单个出生点 */
import * as lib from '../lib/lib'
import FlyingShape from './FlyingShape'
import characteristic from './Characteristic'
import disspation from './Disspation'
import shapeControl from './ShapeControl'
import ShapeManager from './ShapeManager'
import { _kits } from '../../../libdts/kits';

const {ccclass, property} = cc._decorator;

@ccclass
export default class BirthPoint extends cc.Component {
    //----- 编辑器属性 -----//
    /** 出生点所在位置 */
    @property({tooltip:"出生点所在位置", type: lib.defConfig.birthpoint }) birthpos = lib.defConfig.birthpoint.left;
    //飞行轨迹参数
    /** 默认随机形状的速度下限 */
    @property({tooltip:"随机生成形状的速度下限", type: cc.Float }) SpeedLowerLimit:number = 50;
    /** 默认随机形状的速度上限 */
    @property({tooltip:"随机生成形状的速度上限", type: cc.Float }) SpeedUpperLimit:number = 200;
    /** 默认随机形状的入射角下限 */
    @property({tooltip:"随机形状的入射角下限", type: cc.Integer }) AngleLowerLimit:number = -80;
    /** 默认随机形状的入射角上限 */
    @property({tooltip:"随机形状的入射角上限", type: cc.Integer }) AngleUpperLimit:number = 80;
    /** 默认长曲线模式加速度下限 */
    @property({tooltip:"随机形状的长曲线模式角变化速度下限", type: cc.Integer }) deltangleLowerLimit:number = 3;
    /** 默认长曲线模式加速度上限 */
    @property({tooltip:"随机形状的长曲线模式角变化速度上限", type: cc.Integer }) deltangleUpperLimit:number = 30;
    /** 默认螺旋线速度下限 */
    @property({tooltip:"随机形状的螺旋模式螺旋线速度下限", type: cc.Integer }) screwspeedLowerLimit:number = 100;
    /** 默认螺旋线速度上限 */
    @property({tooltip:"随机形状的螺旋模式螺旋线速度上限", type: cc.Integer }) screwspeedUpperLimit:number = 300;
    /** 默认螺旋角速度下限 */
    @property({tooltip:"随机形状的螺旋模式螺旋角速度下限", type: cc.Integer }) screwAngleSpeedLowerLimit:number = 180;
    /** 默认螺旋角速度上限 */
    @property({tooltip:"随机形状的螺旋模式螺旋角速度上限", type: cc.Integer }) screwAngleSpeedUpperLimit:number = 360;
    /** 默认转向距离下限 */
    @property({tooltip:"随机形状的转向模式转向距离下限", type: cc.Integer }) TurnThresholdLowerLimit:number = 150;
    /** 默认转向距离上限 */
    @property({tooltip:"随机形状的转向模式转向距离上限", type: cc.Integer }) TurnThresholdUpperLimit:number = 850;
    /** 默认转向角度下限 */
    @property({tooltip:"随机形状的转向模式转向角度下限", type: cc.Integer }) TurnAngleLowerLimit:number = 1;
    /** 默认转向角度上限 */
    @property({tooltip:"随机形状的转向模式转向角度上限", type: cc.Integer }) TurnAngleUpperLimit:number = 179;
    /** 形状的预制体 */
    @property(cc.Prefab) shapeprefeb: cc.Prefab = null;
    /** 特殊的预制体 */
    @property(cc.Prefab) specialprefeb: cc.Prefab = null;
    /** 形状的父节点 */
    @property(cc.Node) shapeParNode: cc.Node = null;

    //----- 属性声明 -----//
    //进入屏幕前的飞行角
    private InitialAngle = 0;
    //速度倍率，用于难度控制
    private SpeedScaleNum = 1;
    //----- 生命周期 -----//
    // onLoad () {}

    start () {
        // this.schedule(()=>{
        //     // let temp = cc.random0To1() * 100;
        //     if(this.birthpos == lib.defConfig.birthpoint.lefttop)
        //     {
        //         this.createRandomShape();
        //     }
        //     // if(this.birthpos == lib.defConfig.birthpoint.lefttop
        //     // ||this.birthpos == lib.defConfig.birthpoint.leftbottom
        //     // ||this.birthpos == lib.defConfig.birthpoint.righttop
        //     // ||this.birthpos == lib.defConfig.birthpoint.rightbottom)
        //     // {
        //     //     this.createSpecialShape();
        //     //     // let dpare = lib.RandomParameters.RandomParameters.getRandomDisParameters();
        //     //     // let cpare = lib.RandomParameters.RandomParameters.getRandomChaParameters();
        //     //     // let spare = lib.RandomParameters.RandomParameters.getRandomShaParameters();
        //     //     // let fpare = this.getRandomFlyParameters();
        //     //     // fpare.Angle = this.getAngleToPoint(0,0);
        //     //     // this.createAppointShape(fpare,dpare,cpare,spare);
        //     // }
        // },10);
    }

    // update (dt) {}

    //----- 公有方法 -----//
    //返回生成形状的父节点
    getShapeParentNode(){
        return this.shapeParNode;
    }

    //生成指定特殊形状
    createSpecialShape(num:number,para?:_kits.FlyingShape.parameters,Dpara?:_kits.Disspation.parameters,ctype?:_kits.Characteristic.parameters){
        if(ShapeManager.getinstance().getSpecialNum() > 3)
        {
            return;
        }
        let parameters = this.getRandomFlyParameters();
        if(para)
        {
            parameters = para;
        }
        let Ctype:_kits.Characteristic.parameters = {
            type: lib.defConfig.character.none,
            divisionDistance: 0,
        }
        if(ctype)
        {
            Ctype = ctype;
        }
        let Dparameters:_kits.Disspation.parameters = {
            type: lib.defConfig.dissipate.none,
        }
        if(Dpara)
        {
            Dparameters = Dpara;
        }
        let Sparameters:_kits.ShapeControl.parameters = {
            type: num,
            color: 0,
        }
        let shape = cc.instantiate(this.specialprefeb);
        shape.position = this.node.position;
        this.shapeSetPath(shape,parameters);
        //随机形状的特性参数
        this.shapeSetcha(shape,Ctype.type);
        if(Ctype.divisionDistance != 0)
        {
            shape.getComponent(characteristic).setdivisionDistance(Ctype.divisionDistance);
        }
        //随机形状的消散参数
        this.shapeSetdiss(shape,Dparameters);
        //随机形状的外形参数
        shape.getComponent(shapeControl).setShape(Sparameters.type);
        //添加至管理类
        ShapeManager.getinstance().addSpecial(shape);
        //赋值父节点
        shape.parent = this.shapeParNode;
    }

    //设置这个点出生的形状的速度系数
    setSpeed(scale:number){
        if(this.SpeedScaleNum != scale)
        {
            this.SpeedScaleNum = scale;
        }
    }

    //重置这个点出生的形状的速度系数
    resetSpeed(){
        this.SpeedScaleNum = 1;
    }

    
    //获取当前的直线入场角度（边0度，角45度）
    getStarightAngle(){
        if(this.birthpos == lib.defConfig.birthpoint.bottom
        || this.birthpos == lib.defConfig.birthpoint.left
        || this.birthpos == lib.defConfig.birthpoint.right
        || this.birthpos == lib.defConfig.birthpoint.top)
        {
            return 0;
        }
        else if(this.birthpos == lib.defConfig.birthpoint.leftbottom
            || this.birthpos == lib.defConfig.birthpoint.lefttop
            || this.birthpos == lib.defConfig.birthpoint.rightbottom
            || this.birthpos == lib.defConfig.birthpoint.righttop)
        {
            return 45;
        }
    }

    //获取当前出生点到点（x，y）的距离
    getDisToPoint(x:number,y:number){
        let dis = Math.sqrt(((this.node.x - x) * (this.node.x - x) + (this.node.y - y) * (this.node.y - y)));
        return (dis - 200);
    }

    //获取当前出生点到点（x，y）的角度
    getAngleToPoint(x:number,y:number){
        let dis = Math.sqrt(((this.node.x - x) * (this.node.x - x) + (this.node.y - y) * (this.node.y - y)));
        let rad = Math.asin((Math.abs(this.node.y - y) / dis));
        let ang = rad * 180 / Math.PI;
        let angle = 0;
        if(this.birthpos == lib.defConfig.birthpoint.top
            || this.birthpos == lib.defConfig.birthpoint.bottom) 
        {
            rad = Math.asin((Math.abs(this.node.x - x) / dis));
            ang = rad * 180 / Math.PI;
            if((this.node.x > x
            && this.node.y > 0)
            || (this.node.x < x
                && this.node.y < 0))
            {
                angle = -ang;
            }
            else 
            {
                angle = ang;
            }
        }
        else if(this.birthpos == lib.defConfig.birthpoint.righttop
        ||this.birthpos == lib.defConfig.birthpoint.lefttop)
        {
            angle = -ang;
        }
        else if(this.birthpos == lib.defConfig.birthpoint.rightbottom
        ||this.birthpos == lib.defConfig.birthpoint.leftbottom)
        {
            angle = ang;
        }
        else if(this.birthpos == lib.defConfig.birthpoint.right
            ||this.birthpos == lib.defConfig.birthpoint.left)
        {
            if(this.node.y > y)
            {
                angle = -ang;
            }
            else
            {
                angle = ang;
            }
        }
        return angle; 
    }

    //随机形状的飞行轨迹组件参数
    getRandomFlyParameters(){
        //取得一个随机速度
        let speed = (cc.random0To1() * (this.SpeedUpperLimit - this.SpeedLowerLimit) + this.SpeedLowerLimit) * this.SpeedScaleNum;
        //取得一个随机入射角度
        let angle = cc.random0To1() * (this.AngleUpperLimit - this.AngleLowerLimit) + this.AngleLowerLimit;
        //取得一个随机飞行轨迹
        let trajectory = parseInt((cc.random0To1() * (lib.defConfig.Flightpath.length)).toString());
        //取得一个随机长曲线模式角速度加速度
        let deltangle = cc.random0To1() * (this.deltangleUpperLimit - this.deltangleLowerLimit) + this.deltangleLowerLimit;
        //取得一个随机形状的螺旋模式螺旋线速度
        let screwspeed = cc.random0To1() * (this.screwspeedUpperLimit - this.screwspeedLowerLimit) + this.screwspeedLowerLimit;
        //取得一个随机形状的螺旋模式螺旋角速度
        let screwAngleSpeed = cc.random0To1() * (this.screwAngleSpeedUpperLimit - this.screwAngleSpeedLowerLimit) + this.screwAngleSpeedLowerLimit;
        //取得一个随机形状的转向模式转向距离
        let TurnThreshold = cc.random0To1() * (this.TurnThresholdUpperLimit - this.TurnThresholdLowerLimit) + this.TurnThresholdLowerLimit;
        //取得一个随机形状的转向模式转向角度
        let TurnAngle = cc.random0To1() * (this.TurnAngleUpperLimit - this.TurnAngleLowerLimit) + this.TurnAngleLowerLimit;
        //赋值
        // if(trajectory == lib.defConfig.Flightpath.curve)
        // {
        //     if(angle < 0)
        //     {
        //         angle = -angle;
        //     }
        // }
        let parameters: _kits.FlyingShape.parameters = {
            Flightpath: trajectory,
            birthpos: 0,
            Speed: speed,
            Angle: angle,
            deltangle: deltangle,
            screwspeed: screwspeed,
            screwAngleSpeed: screwAngleSpeed,
            TurnThreshold: TurnThreshold,
            TurnAngle: TurnAngle,
        }
        return parameters;
    }

    //创建随机形状
    createRandomShape(){
        let parameters = this.getRandomFlyParameters();
        this._createRandomShape(parameters);
    }

    //创建指定形状
    createAppointShape(parameters:_kits.FlyingShape.parameters,Dparameters:_kits.Disspation.parameters,Ctype:_kits.Characteristic.parameters,Sparameters:_kits.ShapeControl.parameters){
        let shape = cc.instantiate(this.shapeprefeb);
        shape.position = this.node.position;
        this.shapeSetPath(shape,parameters);
        //随机形状的特性参数
        this.shapeSetcha(shape,Ctype.type);
        if(Ctype.divisionDistance != 0)
        {
            shape.getComponent(characteristic).setdivisionDistance(Ctype.divisionDistance);
        }
        //随机形状的消散参数
        this.shapeSetdiss(shape,Dparameters);
        //随机形状的外形参数
        shape.getComponent(shapeControl).setcolor(Sparameters.color);
        shape.getComponent(shapeControl).setShape(Sparameters.type);
        //添加至管理类
        ShapeManager.getinstance().addShape(shape);
        //赋值父节点
        shape.parent = this.shapeParNode;
    }

    //判断角度是否合法
    JudgeAngleLegality(angle)
    {
        if(angle <= this.AngleUpperLimit &&
            angle >= this.AngleLowerLimit)
            {
                return true;
            }
            else
            {
                return false;
            }
    }
    //----- 私有方法 -----//
    //创建一个随机形状
    private _createRandomShape(parameters:_kits.FlyingShape.parameters){
        let shape = cc.instantiate(this.shapeprefeb);
        shape.position = this.node.position;
        this.shapeSetPath(shape,parameters);
        //随机形状的特性参数
        this.shapeSetcha(shape,parseInt((cc.random0To1() * (lib.defConfig.character.length)).toString()));
        //随机形状的消散参数
        let dispare: _kits.Disspation.parameters ={
            type: parseInt((cc.random0To1() * (lib.defConfig.dissipate.length)).toString()),
        }
        dispare.type = lib.defConfig.dissipate.integration;
        this.shapeSetdiss(shape,dispare);
        //随机形状的外形参数
        shape.getComponent(shapeControl).randomcolor();
        if(ShapeManager.getinstance().getassimilation())
        {
            shape.getComponent(shapeControl).setShape(ShapeManager.getinstance().getassimilationShape());
        }
        else
        {
            shape.getComponent(shapeControl).randomShape();
        }
        //添加至管理类
        ShapeManager.getinstance().addShape(shape);
        //赋值父节点
        shape.parent = this.shapeParNode;
    }

    //为传入节点设置形状参数
    private shapeSetshape(node:cc.Node,type:_kits.ShapeControl.parameters){
        let shapediss = node.getComponent(shapeControl);
        shapediss.setcolor(type.color);
        shapediss.setShape(type.type);
    }

    //为传入节点设置消散参数
    private shapeSetdiss(node:cc.Node,type:_kits.Disspation.parameters){
        let shapediss = node.getComponent(disspation);
        shapediss.type = type.type;
    }

    //为传入节点设置特性参数
    private shapeSetcha(node:cc.Node,type:number){
        let shapechara = node.getComponent(characteristic);
        shapechara.type = type;
    }

    //为传入节点设置飞行轨迹参数
    private shapeSetPath(node:cc.Node,parameters:_kits.FlyingShape.parameters){
        let shapepath = node.getComponent(FlyingShape);
        //根据出生点所在位置改变形状出生位置
        switch(this.birthpos)
        {
            case lib.defConfig.birthpoint.left:
                shapepath.birthpos = lib.defConfig.shapebirthpos.left;
                break;
            case lib.defConfig.birthpoint.lefttop:
                if(parameters.Angle >= 0)
                {
                    shapepath.birthpos = lib.defConfig.shapebirthpos.top;
                }
                else
                {
                    shapepath.birthpos = lib.defConfig.shapebirthpos.left;
                }
                break;
            case lib.defConfig.birthpoint.top:
                shapepath.birthpos = lib.defConfig.shapebirthpos.top;
                break;
            case lib.defConfig.birthpoint.righttop:
                if(parameters.Angle >= 0)
                {
                    shapepath.birthpos = lib.defConfig.shapebirthpos.top;
                    parameters.Angle = -parameters.Angle;
                }
                else
                {
                    shapepath.birthpos = lib.defConfig.shapebirthpos.right;
                }
                break;
            case lib.defConfig.birthpoint.right:
                shapepath.birthpos = lib.defConfig.shapebirthpos.right;
                break;
            case lib.defConfig.birthpoint.rightbottom:
                if(parameters.Angle >= 0)
                {
                    shapepath.birthpos = lib.defConfig.shapebirthpos.right;
                }
                else
                {
                    shapepath.birthpos = lib.defConfig.shapebirthpos.bottom;
                    parameters.Angle = -parameters.Angle;
                }
                break;
            case lib.defConfig.birthpoint.bottom:
                shapepath.birthpos = lib.defConfig.shapebirthpos.bottom;
                break;
            case lib.defConfig.birthpoint.leftbottom:
                if(parameters.Angle >= 0)
                {
                    shapepath.birthpos = lib.defConfig.shapebirthpos.left;
                }
                else
                {
                    shapepath.birthpos = lib.defConfig.shapebirthpos.bottom;
                }
                break;
        }
        shapepath.Speed = parameters.Speed;
        shapepath.Angle = parameters.Angle;
        shapepath.Flightpath = parameters.Flightpath;
        shapepath.deltangle = parameters.deltangle;
        shapepath.screwspeed = parameters.screwspeed;
        shapepath.screwAngleSpeed = parameters.screwAngleSpeed;
        shapepath.TurnThreshold = parameters.TurnThreshold;
        shapepath.TurnAngle = parameters.TurnAngle;
    }
}
