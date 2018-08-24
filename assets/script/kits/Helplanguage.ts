/** 帮助界面语言控制 */

const {ccclass, property} = cc._decorator;

@ccclass
export default class Helplanguage extends cc.Component {

    @property(cc.Label) shapeIntroduction: cc.Label = null;
    @property(cc.Label) HPIntroduction: cc.Label = null;
    @property(cc.Label) MPIntroduction: cc.Label = null;
    @property(cc.Label) ThreeIntroduction: cc.Label = null;
    @property(cc.Label) bombIntroduction: cc.Label = null;
    @property(cc.Label) bossIntroduction: cc.Label = null;

    setChinese(){
        this.shapeIntroduction.string = "点中星星加100分 \n点中边框加50分";
        this.HPIntroduction.string = "血量持续扣除，点到星星恢复一定血量，点空扣除一定血量";
        this.MPIntroduction.string = "屏幕两侧为能量槽，消除星星后充能，蓄满后随机触发一种效果！";
        this.ThreeIntroduction.string = "【连续点击三个同边框星星则会消除当前屏幕上所有该边框的星星。】";
        this.bombIntroduction.string = "若点击到炸弹则游戏结束";
        this.bossIntroduction.string = "Boss会吞噬屏幕内所有的星星，玩家成功击败Boss会得到大量的分数";
    }

    setEnglish(){
        this.shapeIntroduction.string = "tap to the star for a score of 100 \ntap to the border for a score of 50";
        this.HPIntroduction.string = "HP continues to decrease,tapping on the star can restore some HP,if you don't hit the star, you will lose some HP";
        this.MPIntroduction.string = "There are energy slots on both sides of the screen,eliminate stars can recharge the energy slots,a random effect is triggered when the energy slots are full!";
        this.ThreeIntroduction.string = "【Clear three stars with the same border in a row, and all stars with the same border on the screen will be cleared】";
        this.bombIntroduction.string = "If a bomb is touched, the game is over";
        this.bossIntroduction.string = "The BOSS will devour all the stars on the screen,wiping out the BOSS can get a lot of score";
    }
}
