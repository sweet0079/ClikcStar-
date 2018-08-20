/** 用于统一控制所有触摸事件 */
import * as lib from '../lib/lib'
import UIControl from './UIControl'
import birthControl from './BirthControl'
import { _kits } from '../../../libdts/kits';
import ShapeManager from './ShapeManager';

const {ccclass, property} = cc._decorator;

@ccclass
export default class ClickControl extends cc.Component {
    //----- 编辑器属性 -----//
    //UI控制组件
    @property(UIControl) UIcon: UIControl = null;
    //字体图集
    @property([cc.SpriteFrame]) ZiSpf: Array<cc.SpriteFrame> = [];
    //字体父节点
    @property(cc.Node) Ziparent: cc.Node = null;
    //数字预制体
    @property(cc.Prefab) scorePfb: cc.Prefab = null;
    //combo预制体
    @property(cc.Prefab) comboPfb: cc.Prefab = null;
    //birthLayout节点
    @property(birthControl) birthLayout: birthControl = null;
    //----- 属性声明 -----//
    private ScoreArr :Array<_kits.ClickShape.ScoreInfo> = [];
    //连击数
    private ComboNum: number = 1;
    //上一个点击的形状
    private LastShape: Array<number> = [];
    //三消连击数
    private SXComboNum: number = 1;
    //三消上一个点击的形状
    private SXLastShape: Array<number> = [];
    //上一个点击的增加了多少三消
    private SXLastAddCombo: number = 0;
    //上一个点击的增加了多少combo
    private LastAddCombo: number = 0;
    //下一个要展示的分数
    private ShowScore: number = 0;
    //下一个要展示的分数位置
    private ShowScorePos: cc.Vec2 = cc.v2(0,0);
    //清屏回调标识
    private SanxiaoFlag: boolean = false;
    //combo数字的节点
    private ComboLabelNode: cc.Node = null;

    //----- 生命周期 -----//

    // onLoad () {}

    start () {
        lib.msgEvent.getinstance().addEvent(lib.msgConfig.SetSXFlag,"setSXFlag",this);
        lib.msgEvent.getinstance().addEvent(lib.msgConfig.clickStart,"add",this);
        lib.msgEvent.getinstance().addEvent(lib.msgConfig.Settlement,"settlement",this);
        lib.msgEvent.getinstance().addEvent(lib.msgConfig.ReStart,"reStart",this);
        lib.msgEvent.getinstance().addEvent(lib.msgConfig.ShowScore,"showScore",this);
    }

    onDestroy(){
        lib.msgEvent.getinstance().removeEvent(lib.msgConfig.SetSXFlag,"setSXFlag",this);
        lib.msgEvent.getinstance().removeEvent(lib.msgConfig.clickStart,"add",this);
        lib.msgEvent.getinstance().removeEvent(lib.msgConfig.Settlement,"settlement",this);
        lib.msgEvent.getinstance().removeEvent(lib.msgConfig.ReStart,"reStart",this);
        lib.msgEvent.getinstance().removeEvent(lib.msgConfig.ShowScore,"showScore",this);
    }
    // update (dt) {}
    //----- 事件回调 -----//
    private showScore(pos:cc.Vec2){
        this.ShowScorePos = pos;
        this.createScore();
    }
    //----- 私有方法 -----//
    /**
     * 清除指定形状
     * @method
     * @param {Array<_kits.ClickShape.ScoreInfo>} ScoreInfoArr 分数数组
     * @private
     */
    private CleanSameShape(){
        this.SanxiaoFlag = true;
        this.SXLastAddCombo = 0;
        this.SXComboNum = 1;
        ShapeManager.getinstance().desAppointShape(this.SXLastShape);
        this.SXLastShape = [];
    }
    
    /**
     * 根据combo，计算获得的能量
     * @method
     * @param {Array<_kits.ClickShape.ScoreInfo>} ScoreInfoArr 分数数组
     * @private
     */
    private CalAddPower(ScoreInfoArr:Array<_kits.ClickShape.ScoreInfo>){
        let basepower = ScoreInfoArr.length * 10;
        if(this.birthLayout.getbossFlag())
        {
            return basepower;
        }
        let ExPower = 0;
        if(this.LastAddCombo == 1)
        {
            ExPower = this.ComboNum * 5 - 5;
        }
        else
        {
            let maxExPower = this.ComboNum * 5 - 5;
            let minExPower = (this.ComboNum - this.LastAddCombo) * 5;
            ExPower = (maxExPower + minExPower) * this.LastAddCombo / 2;
        }
        // console.log("this.ComboNum = " + this.ComboNum);
        // console.log("this.LastAddCombo = " + this.LastAddCombo);
        // console.log("basepower + ExPower = " + (basepower + ExPower));
        return basepower + ExPower;
    }

    /**
     * 根据点击计算三消
     * @method
     * @param {Array<_kits.ClickShape.ScoreInfo>} ScoreInfoArr 分数数组
     * @private
     */
    private CheckSanxiao(ScoreInfoArr:Array<_kits.ClickShape.ScoreInfo>){
        if(this.SanxiaoFlag)
        {
            return;
        }
        //将对象数组整理为形状数组
        let ShapeArr = [];
        for(let i = 0 ; i < ScoreInfoArr.length ; i++)
        {
            if(!ScoreInfoArr[i].isSpecial)
            {
                ShapeArr.push(ScoreInfoArr[i].shape);
            }
        }
        //形状数组长度为0则返回
        if(ShapeArr.length == 0)
        {
            return; 
        }
        //如果没有上次点击数组，将单次点击的形状数组排序后找出数量最多的形状
        if(this.SXLastShape.length == 0)
        {
            if(ShapeArr.length == 1)
            {
                this.SXLastShape = ShapeArr;
                this.SXLastAddCombo = 0;
            }
            else
            {
                //排序
                ShapeArr.sort(function sortNumber(a,b)
                {
                return a - b
                });
                let maxCombo = this.findMaxIndex(ShapeArr).maxCombo;
                let maxIndex:Array<number> = this.findMaxIndex(ShapeArr).maxIndex;
                if(maxCombo == 1)
                {
                    maxIndex.push(ShapeArr[ShapeArr.length - 1]);
                }
                this.SXLastShape = maxIndex;
                this.SXComboNum = maxCombo;
                this.SXLastAddCombo = maxCombo;
            }
        }
        else
        {
            let maxCombo = 0;
            let maxIndex = [];
            for(let i = 0; i < this.SXLastShape.length; i++)
            {
                let temp = 0;
                for(let j = 0; j < ShapeArr.length; j++)
                {
                    if(this.SXLastShape[i] == ShapeArr[j])
                    {
                        temp++;
                    }
                }
                if(temp > maxCombo)
                {
                    maxCombo = temp;
                    maxIndex = [this.SXLastShape[i]];
                }
                else if(temp == maxCombo && temp != 0)
                {
                    maxIndex.push(this.SXLastShape[i]);
                }
            }
            //如果没形成combo，重置combo数，根据这次点击重置LastShape数组
            if(maxCombo == 0)
            {
                this.SXComboNum = 1;
                this.SXLastShape = [];
                this.CheckSanxiao(ScoreInfoArr);
            }
            //形成combo，累加combo数并更新LastShape数组
            else
            {
                this.SXLastShape = maxIndex;
                this.SXComboNum += maxCombo;
                this.SXLastAddCombo = maxCombo;
                let ScoremaxCombo = this.findMaxIndex(ShapeArr).maxCombo;
                let ScoremaxIndex:Array<number> = this.findMaxIndex(ShapeArr).maxIndex;
                if(ScoremaxCombo > this.SXComboNum)
                {
                    this.SXComboNum = ScoremaxCombo;
                    this.SXLastShape = ScoremaxIndex;
                    this.SXLastAddCombo = ScoremaxCombo;
                }
                else if(ScoremaxCombo == this.SXComboNum)
                {
                    for(let i = 0; i < ScoremaxIndex.length ; i++)
                    {
                        this.SXLastShape.push(ScoremaxIndex[i]);
                    }
                }
            }
        }
    }

    /**
     * 根据点击计算combo，如果连续多重点击取最高combo数形状
     * @method
     * @param {Array<_kits.ClickShape.ScoreInfo>} ScoreInfoArr 分数数组
     * @private
     */
    private CheckCombo(ScoreInfoArr:Array<_kits.ClickShape.ScoreInfo>){
        // if(this.birthLayout.getbossFlag())
        // {
        //     return;
        // }
        //将对象数组整理为形状数组
        let ShapeArr = [];
        for(let i = 0 ; i < ScoreInfoArr.length ; i++)
        {
            if(!ScoreInfoArr[i].isSpecial)
            {
                ShapeArr.push(ScoreInfoArr[i].shape);
            }
        }
        //形状数组长度为0则返回
        if(ShapeArr.length == 0)
        {
            return; 
        }
        // console.log("CheckCombo");
        // console.log(this.LastShape);
        // console.log(ShapeArr);
        // console.log("before this.ComboNum = " + this.ComboNum);
        //如果没有上次点击数组，将单次点击的形状数组排序后找出数量最多的形状
        if(this.LastShape.length == 0)
        {
            if(ShapeArr.length == 1)
            {
                this.LastShape = ShapeArr;
                this.LastAddCombo = 0;
            }
            else
            {
                //排序
                ShapeArr.sort(function sortNumber(a,b)
                {
                return a - b
                });
                let maxCombo = this.findMaxIndex(ShapeArr).maxCombo;
                let maxIndex:Array<number> = this.findMaxIndex(ShapeArr).maxIndex;
                if(maxCombo == 1)
                {
                    maxIndex.push(ShapeArr[ShapeArr.length - 1]);
                }
                this.LastShape = maxIndex;
                this.ComboNum = maxCombo;
                this.LastAddCombo = maxCombo;
            }
        }
        else
        {
            let maxCombo = 0;
            let maxIndex = [];
            for(let i = 0; i < this.LastShape.length; i++)
            {
                let temp = 0;
                for(let j = 0; j < ShapeArr.length; j++)
                {
                    if(this.LastShape[i] == ShapeArr[j])
                    {
                        temp++;
                    }
                }
                if(temp > maxCombo)
                {
                    maxCombo = temp;
                    maxIndex = [this.LastShape[i]];
                }
                else if(temp == maxCombo && temp != 0)
                {
                    maxIndex.push(this.LastShape[i]);
                }
            }
            //如果没形成combo，重置combo数，根据这次点击重置LastShape数组
            if(maxCombo == 0)
            {
                this.ComboNum = 1;
                this.LastShape = [];
                this.CheckCombo(ScoreInfoArr);
            }
            //形成combo，累加combo数并更新LastShape数组
            else
            {
                this.LastShape = maxIndex;
                this.ComboNum += maxCombo;
                this.LastAddCombo = maxCombo;
                let ScoremaxCombo = this.findMaxIndex(ShapeArr).maxCombo;
                let ScoremaxIndex:Array<number> = this.findMaxIndex(ShapeArr).maxIndex;
                if(ScoremaxCombo > this.ComboNum)
                {
                    this.ComboNum = ScoremaxCombo;
                    this.LastShape = ScoremaxIndex;
                    this.LastAddCombo = ScoremaxCombo;
                }
                else if(ScoremaxCombo == this.ComboNum)
                {
                    for(let i = 0; i < ScoremaxIndex.length ; i++)
                    {
                        this.LastShape.push(ScoremaxIndex[i]);
                    }
                }
            }
        }
        // console.log("after this.ComboNum = " + this.ComboNum);
    }

    //显示combo数
    private ShowCombo(){
        // if(this.birthLayout.getbossFlag())
        // {
        //     return;
        // }
        if(this.ComboNum < 3)
        {
            return;
        }   
        if(this.ComboLabelNode)
        {
            this.ComboLabelNode.destroy();
        }
        let node = cc.instantiate(this.comboPfb);
        node.getChildByName("number").getComponent(cc.Label).string = this.ComboNum.toString();
        let ani = node.getComponent(cc.Animation);
        ani.once('finished',()=>{
            node.destroy();
            this.ComboLabelNode = null;
        },this);
        node.parent = this.Ziparent;
        this.ComboLabelNode = node;
        ani.play();
    }

    //创建good字样
    private createZiSprite(spf:cc.SpriteFrame){
        let node = new cc.Node('Good');
        let sp = node.addComponent(cc.Sprite);
        sp.spriteFrame = spf;
        node.scale = 0;
        node.setPosition(0,-100);
        node.parent = this.Ziparent;
        let act = cc.scaleTo(0.5,1.5);
        let seq = cc.sequence(act,cc.callFunc(()=>{
            node.destroy();
        }));
        node.runAction(seq);
    }

    //创建分数字样
    private createScore(){
        if(this.ShowScore)
        {
            if(this.ShowScore == 0)
            {
                return;
            }
            let sco = cc.instantiate(this.scorePfb);
            if(this.ShowScore >= 0)
            {
                sco.getComponent(cc.Label).string = this.ShowScore.toString();
            }
            else
            {
                sco.getComponent(cc.Label).string = "/" + Math.abs(this.ShowScore).toString();
            }
            sco.setPosition(this.ShowScorePos);
            sco.y += 75;
            sco.parent = this.Ziparent;
            let ani = sco.getComponent(cc.Animation);
            ani.once('finished',()=>{
                sco.destroy();
            },this);
            ani.play();
        }
    }

    //显示good字样
    private showGood(){
        if(this.ComboNum == 4)
        {
            this.createZiSprite(this.ZiSpf[0]);
        }
        else if(this.ComboNum == 5)
        {
            this.createZiSprite(this.ZiSpf[1]);
        }
        else if(this.ComboNum == 6)
        {
            this.createZiSprite(this.ZiSpf[2]);
        }
        else if(this.ComboNum == 7)
        {
            this.createZiSprite(this.ZiSpf[3]);
        }
        else if(this.ComboNum >= 8)
        {
            this.createZiSprite(this.ZiSpf[4]);
        }
    }

    //重新开始
    private reStart(){
        this.ComboNum = 1;
        this.SXComboNum = 1;
        this.ScoreArr = [];
        this.LastShape = [];
        this.SXLastShape = [];
        this.LastAddCombo = 0;
        this.SXLastAddCombo = 0;
    }

    private setSXFlag(){
        this.SanxiaoFlag = false;
    }

    private add(ScoreInfo:_kits.ClickShape.ScoreInfo){
        // if(this.ScoreArr.length == 0)
        // {
            this.ScoreArr.push(ScoreInfo);
            if(ScoreInfo.score == 100)
            {
               lib.msgEvent.getinstance().emit(lib.msgConfig.micClickStart);
            }
            else if(ScoreInfo.score == 50)
            {
                lib.msgEvent.getinstance().emit(lib.msgConfig.micClickShape);
            }
        // }
        // else
        // {
        //     for(let i = 0; i < this.ScoreArr.length; i++)
        //     {
        //         if(clickscore.node == this.ScoreArr[i].node)
        //         {
        //             console.log("return");
        //             return;
        //         }
        //         else if(i == this.ScoreArr.length - 1)
        //         {
        //             this.ScoreArr.push(clickscore);
        //         }
        //     }
        // }
    }

    private settlement(flag:boolean = true){
        if(this.ScoreArr.length == 0)
        {
            this.ComboNum = 1;
            this.LastShape = [];
            this.SXComboNum = 1;
            this.SXLastShape = [];
            //console.log("扣血");
            this.UIcon.minHP();
            this.ShowScore = 0;
            return;
        }
        else if(this.ScoreArr.length == 1)
        {
            // this.ComboNum++;
            this.CheckCombo(this.ScoreArr);
            this.CheckSanxiao(this.ScoreArr);
            let score = this.ScoreArr[0].score;
            if(ShapeManager.getinstance().getDoubleScore())
            {
                score *= 2;
            }
            this.UIcon.addScore(score);
            this.ShowScore = score;
        }
        else
        {
            // this.ComboNum += this.ScoreArr.length;
            this.CheckCombo(this.ScoreArr);
            this.CheckSanxiao(this.ScoreArr);
            let score = 0;
            for(let i = 0; i < this.ScoreArr.length; i++)
            {
                score += this.ScoreArr[i].score;
                //console.log("i == " + i + "  score ==" + this.ScoreArr[i]);
            }
            score *= 2;
            if(ShapeManager.getinstance().getDoubleScore())
            {
                score *= 2;
            }
            //console.log("length == " + this.ScoreArr.length + " score =" + score);
            this.UIcon.addScore(score);
            this.ShowScore = score;
            lib.msgEvent.getinstance().emit(lib.msgConfig.micclickCombo);
        }
        this.ShowCombo();
        this.showGood();
        if(this.SXComboNum >= 3)
        {
            this.CleanSameShape();
        }
        if(flag)
        {
            this.UIcon.addPOWER(this.CalAddPower(this.ScoreArr));
        }
        this.ScoreArr = [];
    }

    //找出数组中数量最多的元素(已排序过的数组)
    private findMaxIndex(Arr:Array<number>){
        let maxCombo:number = 0;
        let maxIndex:Array<number> = [];
        let temp:number = 1;
        for(let i = 0 ; i < Arr.length - 1; i++)
        {
            if(Arr[i] == Arr[i + 1])
            {
                temp++;
                if(i == Arr.length - 2)
                {
                    if(temp > maxCombo)
                    {
                        maxCombo = temp;
                        maxIndex = [Arr[i]];
                    }
                    else if(temp == maxCombo)
                    {
                        maxIndex.push(Arr[i]);
                    }
                }
            }
            else
            {
                if(temp > maxCombo)
                {
                    maxCombo = temp;
                    maxIndex = [Arr[i]];
                }
                else if(temp == maxCombo)
                {
                    maxIndex.push(Arr[i]);
                }
                temp = 1;
            }
        }
        return {maxCombo,maxIndex};
    }
}