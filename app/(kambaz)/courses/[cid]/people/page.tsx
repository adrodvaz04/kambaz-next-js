'use client';
import { redirect, useParams } from "next/navigation";

export default function People() {
    const { cid } = useParams();
    redirect(`../${cid}/people/table`);
}