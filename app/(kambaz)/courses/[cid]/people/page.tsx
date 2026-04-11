'use client';
import { redirect, useParams } from "next/navigation";
import PeopleTable from "./table";
import * as client from "@/app/(kambaz)/account/client";

export default function People() {
    const { cid } = useParams();
    
    return (
        <PeopleTable users={[]} fetchUsersAction={() => client.findAllUsers} ></PeopleTable>
    )
}