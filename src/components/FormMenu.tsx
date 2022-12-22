import React from 'react';
import styled from 'styled-components';
import {Collapse, Form} from "antd";
import FormField, {IOptions} from "./FormFields";
import {stage as STAGE} from '../graphics/stage'
import ArrayPoints from "./ArrayPoints";
import {IFigurePoint} from "../graphics/types";

// const stage = {...STAGE}
const stage = STAGE

const {Panel} = Collapse

interface IFormMenuProps {
    onChange: (key: string, value: number) => void
}

type OptionType = {
    active: boolean,
    title: string,
    className?: string
    options: IOptions[] | IFigurePoint[]
    type?: 'points'
}

const FormMenu = ({onChange}: IFormMenuProps) => {
    const [form] = Form.useForm()
    // const points = Form.useWatch('points', form);

    // console.log(points)

    const options: OptionType[] = [
        {
            active: true,
            title: 'Main',
            options: [
                {label: 'px/cm', value: stage.px_per_sm, key: 'px_per_sm', col: 6},
                {label: 'W|H', value: stage.grid_width, key: 'grid_width', col: 6},
                {
                    label: 'Show Points',
                    col: 12,
                    value: stage.showPoints,
                    key: 'showPoints',
                    type: 'checkbox'
                },
            ]
        },
        // {
        //     active: true,
        //     title: 'Figure',
        //     type: 'points',
        //     options: stage.figure_points,
        // },
        // {
        //     active: true,
        //     title: 'Shift',
        //     options: [
        //         {label: 'X', value: stage.shift.x, key: 'shift.x'},
        //         {label: 'Y', value: stage.shift.y, key: 'shift.y'},
        //     ]
        // },
        // {
        //     active: false,
        //     title: 'Rotation',
        //     options: [
        //         {label: 'X', value: stage.rotation.x, key: 'rotation.x'},
        //         {label: 'Y', value: stage.rotation.y, key: 'rotation.y'},
        //         {
        //             label: 'Angle',
        //             value: stage.rotation.angle,
        //             key: 'rotation.angle',
        //             col: 12,
        //             slider: {
        //                 min: 0,
        //                 max: Math.PI * 2,
        //                 step: .02,
        //                 marks: {
        //                     0: 0,
        //                     [Math.PI / 2]: 'PI/2',
        //                     [Math.PI]: 'PI',
        //                     [3 * Math.PI / 2]: '3PI/2',
        //                     [Math.PI * 2]: '2PI',
        //                 }
        //             }
        //         },
        //     ]
        // },
        // {
        //     active: false,
        //     title: 'Affine',
        //     options: [
        //         {label: 'Xx', value: stage.affine.xx, key: 'affine.xx'},
        //         {label: 'Xy', value: stage.affine.xy, key: 'affine.xy'},
        //         {label: 'Yx', value: stage.affine.yx, key: 'affine.yx'},
        //         {label: 'Yy', value: stage.affine.yy, key: 'affine.yy'},
        //         {label: 'Ox', value: stage.affine.ox, key: 'affine.ox'},
        //         {label: 'Oy', value: stage.affine.oy, key: 'affine.oy'},
        //     ]
        // },
        // {
        //     active: false,
        //     title: 'Projective',
        //     className: 'projective-menu',
        //     options: [
        //         {label: 'Xx', value: stage.projective.xx, key: 'projective.xx', col: 4},
        //         {label: 'Xy', value: stage.projective.xy, key: 'projective.xy', col: 4},
        //         {label: 'wX', value: stage.projective.wx, key: 'projective.wx', col: 4},
        //         {label: 'Yx', value: stage.projective.yx, key: 'projective.yx', col: 4},
        //         {label: 'Yy', value: stage.projective.yy, key: 'projective.yy', col: 4},
        //         {label: 'wY', value: stage.projective.wy, key: 'projective.wy', col: 4},
        //         {label: 'Ox', value: stage.projective.ox, key: 'projective.ox', col: 4},
        //         {label: 'Oy', value: stage.projective.oy, key: 'projective.oy', col: 4},
        //         {label: 'wO', value: stage.projective.wo, key: 'projective.wo', col: 4},
        //     ]
        // }
    ]

    // React.useEffect(() => {
    //     // console.log({points})
    //     const data = points?.filter((v:IFigurePoint | undefined) => {
    //         if (!v) return false;
    //
    //         return (v.ax >= -999 && v.ay >= -999 && v.bx >= -999 && v.by >= -999)
    //
    //         // if (v.ax >= -999 && v.ay >= -999 && v.bx >= -999 && v.by >= -999)
    //         // const keys = Object.keys(v)
    //         // if (keys.length !== 4) return false;
    //         // // @ts-ignore
    //         // return Object.keys(v).every((i:string) => v[i] >= -999)
    //     })
    //     onChange("figure_points", data || [])
    // }, [points])

    const handleChange = (key: string, value: any) => {
        if (key === 'points') return void 0;

        onChange(key.split('-').join('.'), value)
    }

    const onFinish = (_: any) => {
        _.forEach((i: any) => {
            handleChange(i.name[0], i.value)
        })
    };

    const onSubmit = () => { // only for animation A param
        handleChange('figure-a', form.getFieldValue('figure-a'))
    }

    return (
        <FormMenuStyled
            form={form}
            name="menu"
            className="ant-advanced-search-form"
            onFieldsChange={onFinish}
            onSubmitCapture={onSubmit}
            // onChange={e => console.log(e)}
            size="small"
        >
            <Collapse defaultActiveKey={options.filter(i => i.active).map(i => i.title)}>
                {options.map((i, idx) => (
                    <Panel header={i.title} showArrow={idx !== 0} key={i.title} className={i.className || ''}>
                        {/*// @ts-ignore*/}
                        <FormField options={i.options} form={form} handleChange={handleChange}/>
                    </Panel>
                ))}

                {/*<Panel header="This is panel header with no arrow icon" key="2">*/}
                {/*    <FormFields options={options} />*/}
                {/*</Panel>*/}
            </Collapse>
        </FormMenuStyled>
    )
};

const FormMenuStyled = styled(Form)`
  .projective-menu {
    .ant-input-number {
      max-width: 50px !important;
    }
  }
`

export default (FormMenu);
