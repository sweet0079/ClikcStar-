import { shape } from "../assets/script/lib/cfg/defConfig";

/** kits的接口库 */
declare namespace _kits {
}
declare namespace _kits.FlyingShape {
    interface parameters {
        Flightpath: number,
        birthpos: number,
        Speed: number,
        Angle: number,
        deltangle: number,
        screwspeed: number,
        screwAngleSpeed: number,
        TurnThreshold: number,
        TurnAngle: number,
    }
}
declare namespace _kits.Disspation {
    interface parameters {
        type: number,
    }
}
declare namespace _kits.Characteristic {
    interface parameters {
        type: number,
        divisionDistance: number,
    }
}
declare namespace _kits.ShapeControl {
    interface parameters {
        type: number,
        color: number,
    }
}
declare namespace _kits.ClickShape {
    interface ScoreInfo {
        score: number,
        shape: number,
        isSpecial: boolean,
    }
}