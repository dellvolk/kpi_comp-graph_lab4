import {Button, Form, InputNumber, Slider, Space} from 'antd';
import React from 'react';
import styled from 'styled-components';

interface IArrayPointsProps {
    options: any[]
    handleChange: (key: string, value: any) => void
    fields_watch: any
}

const ArrayPoints: React.FC<IArrayPointsProps> = ({options, handleChange, fields_watch}) => {

    const handleAdd = (add:any) => {
        if (fields_watch?.length > 0) {
            // console.log(fields_watch[fields_watch.length - 1])
            add(fields_watch[fields_watch.length - 1])
        } else {
            add()
        }
    }

    return (
        <ArrayPointsStyled>
            <Form.List name="points"
                       initialValue={options}
            >
                {(fields, {add, remove}) => (
                    <>
                        {fields.map(({key, name, ...restField}) => (
                            <Space key={key} style={{marginBottom: 8, flexWrap: 'wrap'}} align="baseline">
                                <Form.Item
                                    {...restField}
                                    name={[name, 'ax']}
                                    label="A_x"
                                    style={{color: 'blue'}}
                                >
                                    <InputNumber placeholder="A_x"/>
                                </Form.Item>
                                <Form.Item
                                    {...restField}
                                    name={[name, 'ay']}
                                    label="A_y"
                                >
                                    <InputNumber placeholder="A_y"/>
                                </Form.Item>

                                <Button onClick={() => remove(name)}>-</Button>

                                <Form.Item
                                    {...restField}
                                    name={[name, 'bx']}
                                    label="B_x"
                                >
                                    <InputNumber placeholder="B_x"/>
                                </Form.Item>
                                <Form.Item
                                    {...restField}
                                    name={[name, 'by']}
                                    label="B_y"
                                >
                                    <InputNumber placeholder="B_y"/>
                                </Form.Item>
                            </Space>
                        ))}
                        <Form.Item>
                            <Button type="dashed" onClick={() => handleAdd(add)} block>
                                Add point
                            </Button>
                        </Form.Item>
                    </>
                )}
            </Form.List>
        </ArrayPointsStyled>
    )
};

const ArrayPointsStyled = styled.div`
  //max-height: 50vh;
  //overflow-y: auto;
  .ant-space {
    padding: 10px 0;
    border-bottom: 1px solid #ccc;

    .ant-space-item:last-child {
      //width: 100%;
      flex: 1;
    }
  }
  
  label[title=A_x], label[title=A_y] {
    color: blue;
  }

  label[title=B_x], label[title=B_y] {
    color: green;
  }

  label[title=C_x], label[title=C_y] {
    color: red;
  }

  .ant-form-item {
    margin-bottom: 10px;
  }
`

export default (ArrayPoints);
