"use client";

import { Provider } from "react-redux";
import Link from "next/link";
import ArrayStateVariable from "./ArrayStateVariable";
import BooleanStateVariables from "./BooleanStateVariables";
import ClickEvent from "./ClickEvent";
import Counter from "./Counter";
import DateStateVariable from "./DateStateVariable";
import ObjectStateVariable from "./ObjectStateVariable";
import ParentStateComponent from "./ParentStateComponent";
import PassingDataOnEvent from "./PassingDataOnEvent";
import PassingFunctions from "./PassingFunctions";
import StringStateVariables from "./StringStateVariables";
import store from "./redux/store";
import ReduxExamples from "./redux/page";

export default function Lab4() {
  function sayHello() {
    alert("Hello");
  }
  return (
    <Provider store={store}>
      <div id="wd-lab-4">
        <h4>Lab 4</h4>
        <Link href="./lab4/redux"> Redux Examples </Link>
        <br />
        <Link href="./lab4/react-context">React Context Examples</Link>

        <ClickEvent></ClickEvent>
        <PassingDataOnEvent></PassingDataOnEvent>
        <PassingFunctions theFunction={sayHello}></PassingFunctions>
        <Counter></Counter>
        <BooleanStateVariables></BooleanStateVariables>
        <StringStateVariables></StringStateVariables>
        <DateStateVariable></DateStateVariable>
        <ObjectStateVariable></ObjectStateVariable>
        <ArrayStateVariable></ArrayStateVariable>
        <ParentStateComponent></ParentStateComponent>
      </div>
    </Provider>
  );
}
