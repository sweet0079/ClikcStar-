import * as lib from '../lib/lib'

const {ccclass, property} = cc._decorator;

@ccclass
export default class NewClass extends lib.ccAudioPlayer  {

    //----- 编辑器属性 -----//
    //----- 静态属性 -----//
    //----- 静态方法 -----//
    //----- 属性声明 -----//
    private bg = 'res/raw-assets/mic/Stars_BGM.mp3';
    private Bossbg = 'res/raw-assets/mic/Stars_Boss_BGM.mp3';
    private startBtn = 'res/raw-assets/mic/Stars_ui_start.mp3';
    private button = 'res/raw-assets/mic/Stars_ui_menu.mp3';

    private clickCombo = 'res/raw-assets/mic/Stars_combo.mp3';
    private clickStart = 'res/raw-assets/mic/Stars_bingo.mp3';
    private clickShape = 'res/raw-assets/mic/Stars_shapes_on.mp3';
    private clickBG = 'res/raw-assets/mic/Stars_shapes_off.mp3';
    private clickmedkit = 'res/raw-assets/mic/Stars_medkit.mp3';
    private clickbomb = 'res/raw-assets/mic/Stars_bomb.mp3';
    private warning = 'res/raw-assets/mic/Stars_warning.mp3';
    private sanxiao = 'res/raw-assets/mic/Stars_sanxiao.mp3';
    private bossDie = 'res/raw-assets/mic/Stars_BossDie.mp3';
    //----- 公共方法 -----//
    //----- 事件回调 -----//
    msgStartBtn(){
        this.play(3, this.startBtn, false);
    }
    msgbutton(){
        this.play(3, this.button, false);
    }
    msgWarning(){
        this.play(2, this.warning, false);
    }
    msgclickmedkit(){
        this.play(1, this.clickmedkit, false);
    }
    msgclickbomb(){
        this.play(1, this.clickbomb, false);
    }
    msgclickBG(){
        this.play(1, this.clickBG, false);
    }
    msgclickShape(){
        this.play(4, this.clickShape, false);
    }
    msgclickStart(){
        this.play(5, this.clickStart, false);
    }
    msgclickCombo(){
        this.play(6, this.clickCombo, false);
    }
    msgPlaySanXiao(){
        this.play(7, this.sanxiao, false);
    }
    msgPlayBossDie(){
        this.play(8, this.bossDie, false);
    }
    msgPlayBGM(){
        this.play(0, this.bg, true);
    }
    msgPlayBossBGM(){
        this.play(0, this.Bossbg, true);
    }
    //----- 按键回调 -----//
    //----- 生命周期 -----//

    //----- 保护方法 -----//
    //----- 私有方法 -----//
    onLoad() {
        super.onLoad();

        let msgEvent = lib.msgEvent.getinstance();
        msgEvent.addEvent(lib.msgConfig.micStartBtn, 'msgStartBtn', this);
        msgEvent.addEvent(lib.msgConfig.micbutton, 'msgbutton', this);
        msgEvent.addEvent(lib.msgConfig.ShowWarn, 'msgWarning', this);
        msgEvent.addEvent(lib.msgConfig.addHP, 'msgclickmedkit', this);
        msgEvent.addEvent(lib.msgConfig.micBomb, 'msgclickbomb', this);
        msgEvent.addEvent(lib.msgConfig.micMinHP, 'msgclickBG', this);    
        msgEvent.addEvent(lib.msgConfig.micClickStart, 'msgclickStart', this);   
        msgEvent.addEvent(lib.msgConfig.micClickShape, 'msgclickShape', this);      
        msgEvent.addEvent(lib.msgConfig.micclickCombo, 'msgclickCombo', this);   
        msgEvent.addEvent(lib.msgConfig.micPlayBGM, 'msgPlayBGM', this);   
        msgEvent.addEvent(lib.msgConfig.micPlayBossBGM, 'msgPlayBossBGM', this);   
        msgEvent.addEvent(lib.msgConfig.micSanXiao, 'msgPlaySanXiao', this);   
        msgEvent.addEvent(lib.msgConfig.micBossDie, 'msgPlayBossDie', this); 
    }
    start() {
        super.start();
        this.msgPlayBGM();
    }
    onDestroy() {
        let msgEvent = lib.msgEvent.getinstance();
        msgEvent.removeEvent(lib.msgConfig.micStartBtn, 'msgStartBtn', this);
        msgEvent.removeEvent(lib.msgConfig.micbutton, 'msgbutton', this);
        msgEvent.removeEvent(lib.msgConfig.ShowWarn, 'msgWarning', this);
        msgEvent.removeEvent(lib.msgConfig.addHP, 'msgclickmedkit', this);
        msgEvent.removeEvent(lib.msgConfig.micBomb, 'msgclickbomb', this);
        msgEvent.removeEvent(lib.msgConfig.micMinHP, 'msgclickBG', this);   
        msgEvent.removeEvent(lib.msgConfig.micClickStart, 'msgclickStart', this);   
        msgEvent.removeEvent(lib.msgConfig.micClickShape, 'msgclickShape', this);    
        msgEvent.removeEvent(lib.msgConfig.micclickCombo, 'msgclickCombo', this);     
        msgEvent.removeEvent(lib.msgConfig.micPlayBGM, 'msgPlayBGM', this);   
        msgEvent.removeEvent(lib.msgConfig.micPlayBossBGM, 'msgPlayBossBGM', this);  
        msgEvent.removeEvent(lib.msgConfig.micSanXiao, 'msgPlaySanXiao', this);    
        msgEvent.removeEvent(lib.msgConfig.micBossDie, 'msgPlayBossDie', this);   
        super.onDestroy();
    }
}
