/** 游戏界面语言控制 */

import HelpLanguage from './Helplanguage'
import * as lib from '../lib/lib'

const {ccclass, property} = cc._decorator;

@ccclass
export default class MainSceneLanguage extends cc.Component {

    @property(HelpLanguage) HelpLayer: HelpLanguage = null;
    @property(cc.Label) ScoreStr: cc.Label = null;
    @property(cc.Label) ShareReliveStr: cc.Label = null;
    @property(cc.Label) ShareDoubleStr: cc.Label = null;
    @property(cc.RichText) SkipStr: cc.RichText = null;

    start () {
        if(lib.lanConfig.nowLanguage == lib.lanConfig.Language.english)
        {
            this.setEnglish();
        }
        else if(lib.lanConfig.nowLanguage == lib.lanConfig.Language.chinese)
        {
            this.setChinese();
        }
    }

    setChinese(){
        lib.lanConfig.setChinese();
        this.HelpLayer.setChinese();
        this.ScoreStr.string = lib.lanConfig.ScoreStrCN;
        this.ShareReliveStr.string = lib.lanConfig.ShareReliveStrCN;
        this.ShareDoubleStr.string = lib.lanConfig.ShareDoubleStrCN;
        this.SkipStr.string = lib.lanConfig.SkipStrCN;
    }

    setEnglish(){
        lib.lanConfig.setEnglish();
        this.HelpLayer.setEnglish();
        this.ScoreStr.string = lib.lanConfig.ScoreStrEN;
        this.ShareReliveStr.string = lib.lanConfig.ShareReliveStrEN;
        this.ShareDoubleStr.string = lib.lanConfig.ShareDoubleStrEN;
        this.SkipStr.string = lib.lanConfig.SkipStrEN;
    }
}
