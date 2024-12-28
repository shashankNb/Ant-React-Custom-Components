import {createUseStyles} from "react-jss";


const margins = {
    m0: {margin: 0},
    m1: {margin: '1rem'},
    m2: {margin: '2rem'},
    m3: {margin: '3rem'},
    m4: {margin: '4rem'},
    m5: {margin: '5rem'},
    mt1: {marginTop: '1rem'},
    mt2: {marginTop: '2rem'},
    mt3: {marginTop: '3rem'},
    mt4: {marginTop: '4rem'},
    mt5: {marginTop: '5rem'},
    mb1: {marginBottom: '1rem'},
    mb2: {marginBottom: '2rem'},
    mb3: {marginBottom: '3rem'},
    mb4: {marginBottom: '4rem'},
    mb5: {marginBottom: '5rem'},
    ml1: {marginLeft: '1rem'},
    ml2: {marginLeft: '2rem'},
    ml3: {marginLeft: '3rem'},
    ml4: {marginLeft: '4rem'},
    ml5: {marginLeft: '5rem'},
    mr0: {marginRight: 0},
    mr1: {marginRight: '1rem'},
    mr2: {marginRight: '2rem'},
    mr3: {marginRight: '3rem'},
    mr4: {marginRight: '4rem'},
    mr5: {marginRight: '5rem'},
}

const paddings = {
    p0: {padding: 0},
    p1: {padding: '1rem'},
    p2: {padding: '2rem'},
    p3: {padding: '3rem'},
    p4: {padding: '4rem'},
    p5: {padding: '5rem'},
    pt1: {paddingTop: '1rem'},
    pt2: {paddingTop: '2rem'},
    pt3: {paddingTop: '3rem'},
    pt4: {paddingTop: '4rem'},
    pt5: {paddingTop: '5rem'},
    pb1: {paddingBottom: '1rem'},
    pb2: {paddingBottom: '2rem'},
    pb3: {paddingBottom: '3rem'},
    pb4: {paddingBottom: '4rem'},
    pb5: {paddingBottom: '5rem'},
    pl1: {paddingLeft: '1rem'},
    pl2: {paddingLeft: '2rem'},
    pl3: {paddingLeft: '3rem'},
    pl4: {paddingLeft: '4rem'},
    pl5: {paddingLeft: '5rem'},
    pr1: {paddingRight: '1rem'},
    pr2: {paddingRight: '2rem'},
    pr3: {paddingRight: '3rem'},
    pr4: {paddingRight: '4rem'},
    pr5: {paddingRight: '5rem'},
}

const buttons = {
    'btnSuccess': {
        backgroundColor: '#87d068',
        color: '#FFF'
    },
    'btnPrimary': {
        backgroundColor: '#108ee9',
        color: '#FFF'
    },
    'btnInfo': {
        backgroundColor: '#2db7f5',
        color: '#FFF'
    },
    'btnWarning': {
        backgroundColor: '#fff7e6',
        color: '#ffd591',
        borderColor: '#d46b08'
    }

};

const useStyles = createUseStyles({
    primary: {color: '#337ab7'},
    positionRelative: {position: 'relative'},
    h100: {minHeight: '100px'},
    h130: {minHeight: '130px'},
    cursorPointer: {cursor: 'pointer'},
    bgTransparent: {backgroundColor: 'transparent', opacity: 0.5, pointerEvents: 'none'},
    tabBackGround: {
        backgroundColor: 'rgb(240, 242, 245)',
        padding: '15px',
        borderRadius: '5px'
    },
    displayNone: {display: 'none'},
    displayBlock: {display: 'block'},
    displayInline: {display: 'inline'},
    displayInlineBlock: {display: 'inline-block'},
    buttonSticky: {borderTopLeftRadius: 0, borderTopRightRadius: 0},
    fontWeightBold: {fontWeight: "bold"},
    fontWeightBolder: {fontWeight: "bolder"},
    ...margins,
    ...paddings,
    ...buttons

});

export default useStyles;