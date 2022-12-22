import React from 'react';
import styled from 'styled-components';
import Core from "../graphics";
import FormMenu from "./FormMenu";
import {IPoint, ICore} from "../graphics/types";
//import FormMenu from "./FormMenu";

class Menu extends React.Component {
    // core: ICore;

    state = {
        // history: [] as IPoint[]
    }

    // updateHistory = (history: IPoint[]) => {
    //     // this.setState({history})
    // }
    core: ICore;

    // private core = {} as typeof Core

    constructor(props:{}) {
        super(props);
        this.core = Core()
    }

    componentDidMount() {
        console.log(this.core)
        this.core.draw()
        // @ts-ignore
        window.core = this.core
    }

    onChange = (key: string, value: number) => {
        // console.log({key, value})
        this.core.set(key, value)
    };

    render() {
        return (
            <MenuStyled>
                {/*<Card*/}
                {/*    type="inner"*/}
                {/*    title="Inner Card title"*/}
                {/*    extra={<a href="#">More</a>}*/}
                {/*>*/}
                {/*    Inner Card content*/}
                {/*</Card>*/}
                <FormMenu onChange={this.onChange}/>
            </MenuStyled>
        )
    }
}

const MenuStyled = styled.div`
  flex: 0 0 350px;
  padding: 10px 10px 10px 0;
  max-height: 100vh;
  overflow-y: auto;
  //padding-left: 0;
  //border-left: 1px solid #ccc;
`

export default (Menu);
