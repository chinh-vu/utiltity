import React from 'react';
import {BasicLink, PortletLink} from '../../link/Link';
import {PortletURL} from '../../link/PortletURL';
import moment from 'moment';
import Tooltip from "@material-ui/core/Tooltip";
import {withStyles, makeStyles} from '@material-ui/core/styles';

const LinkableIndex = {
    params: 0,
    display: 1,
};

const defaultDateFormat = 'MMM DD, YYYY';
// const defaultDateFormat = 'MM/DD/YYYY';

const LightTooltip = withStyles((theme) => ({
    tooltip: {
        backgroundColor: theme.palette.common.gray,
        color: 'white',
        fontSize: 13,
    },
}))(Tooltip);


function createColumn(key, label) {
    return {key, label, renderLabel: (column) => column.label};
}

function createSDCRecord(instructions, record) {
    let row = {};

    instructions.map((instruction) => {
        let sdcInstruction = JSON.parse(JSON.stringify(instruction));

        if (instruction['SDC'] !== undefined) {
            if (record['allowOverride'] === true) {
                row[instruction['description']] = Liferay.Language.get('sdc.linkable.icon')
            } else {
                row[instruction['description']] = Liferay.Language.get('sdc.nonlinkable.icon')
            }

            createLinkableAttribute(instruction, record, row)
        } else row[instruction['description']] = '';
    });

    return row;
}

function createLinkableAttribute(instruction, record, row) {
    let linkable = instruction['linkable'];
    try {
        if (linkable !== undefined) {
            let paramsInst = linkable.params;
            let params = [];
            if (paramsInst !== undefined && paramsInst.length > 0) {
                paramsInst.map(item => {
                    if (item.value !== undefined) {
                        params.push([item.name, item.value]);
                    } else if (item.inst !== undefined) {
                        params.push([item.name, readParseIndividuallDataElement(item.inst, record, instruction)]);
                    }
                });
                row[instruction['description']] = [params, row[instruction['description']]];
            }
        }
    } catch (e) {
        console.log('exception: something went wrong ', instruction);
    }

    return row;
}

export function createRowData(insts, indData) {
    let rowData = {};
    if (indData && indData.hasOwnProperty('isProtected')) {
        return createSDCRecord(insts, indData);
    } else if (indData) {
        insts.map((instr) => {
            if (instr.hasOwnProperty('complex')) {
                rowData[instr['description']] =
                    parseComplexDataElement(instr, indData);
            } else {
                let tValue = instr['value'] !== undefined ? instr['value'] :
                    readParseIndividuallDataElement(instr['inst'], indData, instr);

                if (instr['format'] !== undefined && instr['format']['valueType'] !== undefined && instr['format']['valueType'] === 'date') {
                    let date = '';

                    if (tValue !== null && tValue.length > 10) {
                        // trimmed off timezone for now
                        tValue = tValue.substr(0, 10);
                    }

                    if (instr['format']['inputPattern'] !== undefined) {
                        date = moment(tValue, instr['format']['inputPattern']);
                    } else {
                        date = moment(tValue);
                    }

                    if (date.isValid()) {
                        tValue = date.format(instr['format']['outputPattern'] ? instr['format']['outputPattern'] : defaultDateFormat);
                    } else tValue = '';
                }
                if (instr['render'] !== undefined && !Array.isArray(tValue)) {
                    let tmpValue = instr['render'](tValue);

                    tValue = tmpValue;
                }

                rowData[instr['description']] = (tValue === "null" ? '' : tValue);
            }

            let linkable = instr['linkable'];
            try {
                if (linkable !== undefined) {
                    let paramsInst = linkable.params;
                    let params;
                    if (paramsInst !== undefined && paramsInst.length > 0) {
                        params = [];
                        paramsInst.map(item => {
                            if (item.value !== undefined) {
                                params.push([item.name, item.value]);
                            } else if (item.inst !== undefined) {
                                params.push([item.name, readParseIndividuallDataElement(item.inst, indData)]);
                            }
                        });
                        rowData[instr['description']] = [params, rowData[instr['description']]];
                    }
                }
            } catch (e) {
                console.log('exception: something went wrong ', instr);
            }
        });
    }
    return rowData;
}

function parseComplexDataElement(instructions, record) {
    let tmp = [];
    instructions['complex']['inst'].map((cInstr) => {
        tmp.push(readParseIndividuallDataElement(cInstr['inst'], record, instructions));
    });

    let isNullValueElement = () => {
        if (tmp && Array.isArray(tmp)) {
            const isN = tmp.find(t => !t) !== undefined;
            return isN;
        }

        return false;
    };

    if (isNullValueElement()) {
        return '';
    }

    if (instructions['complex']['render']) {
        return instructions['complex']['render'](tmp);
    } else if (tmp && tmp.length > 0) {
        let display = '';

        let isComma = false;
        for (let i = 0; i < tmp.length; i++) {
            if (tmp[i] && tmp[i].length > 1) {
                if (isComma === true) display = display + ', ';

                display = display + tmp[i];
                isComma = true;

            }
        }
        return display;
    }
    return tmp;
}

function isNullValueFound(data) {
    return data[LinkableIndex.display] ? false : true;
}

function LinkHandler({data, linkableConfig}) {
    let oParams;
    if (isNullValueFound(data)) {
        return (
            <span><i className="fas fa-lock color-platinum"
                     alt={data[LinkableIndex.display]}></i>&nbsp;{Liferay.Language.get('global.invalid.record.label')}</span>

        );
    }

    if (data[LinkableIndex.params]) {
        oParams = {};
        data[LinkableIndex.params].map((item, key) => {
            if (item && item.length === 2 && item[1] && item[0]) {
                oParams[item[0]] = item[1];
            }
        });
    }

    if (linkableConfig.type === 'portlet') {
        if (data[LinkableIndex.display] === Liferay.Language.get('sdc.linkable.icon')) {
            oParams[PortletURL.CommonParams.PAGE_VIEW] = PortletURL.CommonViews.SDCOVERRIDE;
            return (
                <span><i className="fas fa-lock color-gold"
                         alt={data[LinkableIndex.display]}></i>&nbsp;
                    <BasicLink
                        onClick={linkableConfig['invoke']}>{Liferay.Language.get('sdc.protected.data.override')}</BasicLink>
                </span>
            );
        } else if (data[LinkableIndex.display] === Liferay.Language.get('sdc.nonlinkable.icon')) {
            return (
                <span><i className="fas fa-lock color-platinum"
                         alt={data[LinkableIndex.display]}></i>&nbsp;{Liferay.Language.get('sdc.protected.data')}</span>

            );
        } else {
            return (
                <PortletLink portletNamespace={linkableConfig.portletNamespace}
                             portletId={linkableConfig.portletId}
                             href={linkableConfig.url}
                             onClick={linkableConfig.callback ? (href) => {
                                 return linkableConfig.callback(href, oParams);
                             } : undefined}
                             windowState={linkableConfig.windowState}
                             params={oParams}>{data[LinkableIndex.display]}</PortletLink>
            );
        }
    } else {
        return (
            <BasicLink href={linkableConfig.url}
                       onClick={linkableConfig.callback ? (href) => {
                           return linkableConfig.callback(href, oParams);
                       } : undefined}
                       params={oParams}>{data[LinkableIndex.display]}</BasicLink>
        );
    }

}

function HTMLHandler({type, data, cls}) {
    if (!data) return (<span></span>);
    if (type === 'date') {
        return (
            <span title={data} className={cls}>{data}</span>
        )
    } else if (type === 'datasource') {
        const sourceIcon = {
            'provider direct': 'fa-user-nurse',
            'provider indirect': 'fa-user-nurse',
            'staff direct': 'fa-clipboard-user',
            'staff indirect': 'fa-clipboard-user',
            'system interface': 'fa-desktop-alt',
            'individual direct': 'fa-user',
            'individual indirect': 'fa-user',
        }[data.trim().toLowerCase()];

        return (
            <LightTooltip
                title={data}
                placement="top-start"
                arrow
            >
                <div className="cellCentered">
                    <i className={`fad ${sourceIcon || 'fa-desktop-alt'} ${cls || ''}`}></i>
                </div>
            </LightTooltip>
        )
    } else if (type === 'indicator') {
        let color;
        if (data.toLowerCase().includes('abnormal')) color = '#eed202';
        else if (data.toLowerCase().includes('critical')) color = '#ff0000';
        else if (data.toLowerCase().includes('normal')) color = '#50c878';

        return (
            <LightTooltip
                title={data}
                placement="top-start"
                arrow
            >
                <div className="cellCentered" style={{color}}>
                    <i className={cls}></i>
                </div>
            </LightTooltip>
        )
    }
}

export function createData(insts, rawData) {
    let data = [];
    if (rawData) {
        rawData.map((d) => {
            let tmpData = createRowData(insts, d);

            if (isValidRecord(insts, tmpData)) {
                data.push(tmpData);
            }
        });
    }

    return data;
}

function isValidRecord(instrs, d) {
    if (instrs && d) {
        let goodRecord = true;
        instrs.map((i) => {

            if (i && i['linkable']) {
                goodRecord = !isNullValueFound(d[i['description']]);
            }

        });
        return goodRecord;
    }

    return false;
}


export function createColumns(insts) {
    let columns = [];

    insts.map((inst) => {
        let tmp = createColumn(inst['description'], inst['description']);

        if (inst.hasOwnProperty('linkable')) {
            tmp['render'] = (value) => <LinkHandler data={value} linkableConfig={inst.linkable}/>;
        } else if (inst.hasOwnProperty('format') && (inst.format.valueType === 'date' || !!inst.format.outputPattern || !!inst.format.inputPattern)) {
            tmp['render'] = (value) => <HTMLHandler type={'date'} data={value} cls={'dateCell'}/>;
        } else if (inst.hasOwnProperty('format') && (inst.format.valueType === 'dataSource')) {
            tmp['render'] = (value) => <HTMLHandler type={'datasource'} data={value}/>;
        } else if (inst.hasOwnProperty('format') && (inst.format.valueType === 'indicator')) {
            tmp['render'] = (value) => <HTMLHandler type={'indicator'} data={value} cls={'fad fa-circle'}/>;
        }
        columns.push(tmp);
    });

    return columns;
}

function readParseIndividuallDataElement(inst, sRcd, eleInstr) {
    let d = sRcd;
    // step through the instuction and retreive each individual node till last instructions
    // return the value
    let isComplex = false;

    if (inst && inst.length > 0) {
        for (let i = 0; i < inst.length; i++) {
            // console.log(inst[i], "   Input data in FOR LOOP : ", d[inst[i]]);
            // not a leaf yet
            if (d[inst[i]] !== undefined && typeof d[inst[i]] === 'object') {
                d = d[inst[i]];

                if (eleInstr && Array.isArray(d) && eleInstr['format'] && eleInstr['format']['valueType'] && eleInstr['format']['valueType'] === 'array') {
                    return d;
                } else if (eleInstr && Array.isArray(d) && eleInstr['format'] && eleInstr['format']['valueType'] && eleInstr['format']['valueType'] === 'indicator') {
                    if (!d || d.length < 1) return null;
                    const indicatorPriorities = [
                        'Normal',
                        'Abnormal Low',
                        'Abnormal',
                        'Abnormal High',
                        'Critical Low',
                        'Critical',
                        'Critical High',
                    ];
                    let highest = -1;

                    d
                        .filter(observation => observation.indicator !== 'null')
                        .forEach(observation =>
                            highest = Math.max(indicatorPriorities
                                .findIndex(e => e === observation.indicator), highest))

                    if (highest > -1) return indicatorPriorities[highest];
                    return null;
                } else if (eleInstr['format'] && eleInstr['format']['valueType'] && eleInstr['format']['valueType'] === 'dataSource') {
                    return d[0]
                        .replace(/entry/ig, '')
                        .replace(/data acquisition method/ig, '');
                } else if (eleInstr && Array.isArray(d) && eleInstr['format'] && eleInstr['format']['valueType'] && eleInstr['format']['valueType'] !== 'array') {
                    return d.join(',');
                }
            } else {
                try {
                    let t = d[inst[i]];
                    if (t === undefined) {
                        return null;
                    }
                    return t;
                } catch (e) {
                    return null;
                }
            }
        }
    }

    return null;
}
