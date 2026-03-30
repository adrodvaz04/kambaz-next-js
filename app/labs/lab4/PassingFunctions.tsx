"use client"
export default function PassingFunctions(
 { theFunction }: { theFunction: () => void }) { //apparently should end with -Action to indicate server action
  return (
    <div>
      <h2>Passing Functions</h2>
      <button onClick={theFunction} className="btn btn-primary">
        Invoke the Function
      </button>
      <hr/>
    </div>
);}
