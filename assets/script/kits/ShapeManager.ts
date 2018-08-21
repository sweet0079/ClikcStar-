/** 形状管理器脚本 */
import * as lib from '../lib/lib'
import FlyingShape from './FlyingShape'
import ShapeControl from './ShapeControl'

export default class ShapeManager {
    static instance: ShapeManager
    /** 获取单例 */
    static getinstance() {
        if (ShapeManager.instance) return ShapeManager.instance;
        else return new ShapeManager();
    }
    /** 返回一个新的单例 */
    static newinstance() {
        return new ShapeManager();
    }

    private constructor() {
        this.shapeArr = [];
        this.specialArr = [];
        this._frozen = false;
        this._doubleScore = false;
        this._big = false;
        this._small = false;
        this._assimilation = false;
        ShapeManager.instance = this;
    }

    private shapeArr: Array<cc.Node>;
    private specialArr: Array<cc.Node>;
    private _frozen:boolean;
    private _doubleScore:boolean;
    private _big:boolean;
    private _small:boolean;
    private _assimilation:boolean;
    private _assimilationShape:number;
    //返回同化形状
    getassimilationShape(){
        return this._assimilationShape;
    }

    //返回是否同化
    getassimilation(){
        return this._assimilation;
    }

    //设置是否同化
    setassimilation(Flag:boolean){
        this._assimilation = Flag;
    }

    //返回是否是缩小
    getsmall(){
        return this._small;
    }

    //设置是否是缩小
    setsmall(Flag:boolean){
        this._small = Flag;
    }

    //返回是否是放大
    getbig(){
        return this._big;
    }

    //设置是否是放大
    setbig(Flag:boolean){
        this._big = Flag;
    }

    //返回是否是双倍分数
    getDoubleScore(){
        return this._doubleScore;
    }

    //设置是否是双倍分数
    setDoubleScore(Flag:boolean){
        this._doubleScore = Flag;
    }

    //返回是否是冰冻
    getFrozen(){
        return this._frozen;
    }

    //设置是否是冰冻
    setFrozen(Flag:boolean){
        this._frozen = Flag;
    }

    //获取普通形状数量
    getNum(){
        return this.shapeArr.length;
    }

    //获取特殊形状数量
    getSpecialNum(){
        return this.specialArr.length;
    }

    //添加一个特殊形状
    addSpecial(special:cc.Node){
        this.specialArr.push(special);
        // console.log("addspecial");
    }
    
    //增加
    addShape(shape:cc.Node){
        this.shapeArr.push(shape);
        // console.log("add");
    }

    //删除传入的节点
    delShape(shape:cc.Node){
        let index = this.shapeArr.indexOf(shape);
        if (index > -1) {
            // console.log("del");
            this.shapeArr.splice(index, 1);
            // console.log(this.shapeArr);
        }
        else
        {
            index = this.specialArr.indexOf(shape);
            if (index > -1) {
                // console.log("delspecial");
                this.specialArr.splice(index, 1);
                // console.log(this.specialArr);
            }
        }
    }

    //清空
    clean(){
        this.shapeArr = [];
        this.specialArr = [];
        this._frozen = false;
        this._doubleScore = false;
        this._big = false;
        this._small = false;
        this._assimilation = false;
    }

    //同化所有形状
    assimilationNoreShape(){
        let temp = lib.RandomParameters.RandomParameters.getRandomInt(5);
        for(let i = 0; i < this.shapeArr.length; i++)
        {
            this.shapeArr[i].getComponent(ShapeControl).setShape(temp);
        }
        this._assimilation = true;
        this._assimilationShape = temp;
    }

    //爆炸所有指定形状
    desAppointShape(arr:Array<number>){
        let index = 0;
        for(let j = 0; j < arr.length ; j++)
        {
            for(let i = 0; i < this.shapeArr.length; i++)
            {
                let shapeCon = this.shapeArr[i].getComponent(ShapeControl);
                if(shapeCon.gettype()[0] == arr[j])
                {
                    index++;
                    this.shapeArr[i].getComponent(ShapeControl).bombCallBack(parseInt((index / 8).toString()) * 0.1);
                    this.delShape(this.shapeArr[i]);
                    i--;
                }
            }
        }
    }

    //爆炸所有普通形状
    desNormalShape(){
        for(let i = 0; i < this.shapeArr.length; i++)
        {
            this.shapeArr[i].getComponent(ShapeControl).bombCallBack();
        }
        this.shapeArr = [];
    }

    //删除所有普通形状
    delNormalShape(){
        for(let i = 0; i < this.shapeArr.length; i++)
        {
            this.shapeArr[i].destroy();
        }
        this.shapeArr = [];
    }

    //删除所有形状
    delAllShape(){
        this.delNormalShape();
        for(let i = 0; i < this.specialArr.length; i++)
        {
            this.specialArr[i].destroy();
        }
        this.clean();
    }

    //暂停所有形状
    pauseAllShape(){
        for(let i = 0; i < this.shapeArr.length; i++)
        {
            this.shapeArr[i].getComponent(FlyingShape).setStopFlag(true);
        }
        for(let i = 0; i < this.specialArr.length; i++)
        {
            this.specialArr[i].getComponent(FlyingShape).setStopFlag(true);
        }
    }

    //继续所有形状
    continueAllShape(){
        for(let i = 0; i < this.shapeArr.length; i++)
        {
            this.shapeArr[i].getComponent(FlyingShape).setStopFlag(false);
        }
        for(let i = 0; i < this.specialArr.length; i++)
        {
            this.specialArr[i].getComponent(FlyingShape).setStopFlag(false);
        }
    }
}