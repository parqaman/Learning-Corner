import {File as OwnFile, User} from "../entities";
import fs from "fs";
import path from "path";
import {wrap} from "@mikro-orm/core";

export const uploadPath = path.join(
    __dirname,
    process.env.STORAGE_PATH || "../../upload/tmp"
);

export const storagePath = path.join(
    __dirname,
    process.env.STORAGE_PATH || "../../upload/files"
);

export const profilePath = path.join(
    __dirname,
    process.env.STORAGE_PATH || "../../upload/profile"
);
export function deleteSectionFiles(files: OwnFile[], sectionId: string){
    try {
        for(const file of files){
            fs.unlinkSync(path.join(storagePath, sectionId, file.name))
        }
        fs.rmdirSync(path.join(storagePath, sectionId))
    } catch (e) {
        console.log(e)
    }
}

export function deleteProfilePicture(user: User){
    try {
        if (user.photo !== null && user.photo !== "profile_empty.png")
            fs.unlinkSync(path.join(profilePath, user.photo));
    } catch (e) {
        console.log(e)
    }
}