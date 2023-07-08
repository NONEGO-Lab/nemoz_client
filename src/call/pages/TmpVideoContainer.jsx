import React from 'react';
import Header from "../../shared/Header";
import {SizeLayout} from "../../shared/Layout";
import { ReactionButton } from "../../reaction/pages/components/index";

const TmpVideoContainer = () => {
    return (
        <SizeLayout>
            <Header/>
            <div className={"h-[700px] bg-red-400 flex flex-col justify-center"}>
                <div className={"h-[150px] bg-amber-600 flex justify-center pt-[100px] text-[18px]"}>
                    fan meeting title Area
                </div>
                <div className={"h-[350px] bg-yellow-400 flex flex-row justify-between p-[10px]"}>
                    <div className={"w-[48%] bg-blue-300 flex flex-col"}>
                    <div className={"text-center"}>Fan Info</div>
                    <div className={`relative h-[360px] border-2 border-box border-black flex`}>Fan Video</div>
                    <div className={"text-center"}>Fan Letter</div>
                    </div>
                    <div className={"w-[48%] bg-purple-300 flex flex-col"}>
                    <div className={"text-center"}>Artist Info</div>
                    <div className={`relative h-[360px] border-2 border-box border-black flex`}>Artist Video</div>
                    <div className={"text-center"}>Artist Letter</div>
                    </div>
                </div>
                <div className={"h-[200px] bg-green-400 flex flex-col "}>
                    <div className={"bg-pink-600 h-[40%] flex justify-center items-center"}>
                        <ReactionButton />
                    </div>
                    <div className={"bg-indigo-600 h-[60%] flex justify-center items-center"}>Staff Interaction Area</div>
                </div>
            </div>
        </SizeLayout>
    );
};

export default TmpVideoContainer;