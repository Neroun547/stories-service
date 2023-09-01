import { Injectable } from "@nestjs/common";
import { createHmac } from "crypto";

@Injectable()
export class CommonService {
    generateRandomHash(dataToHash: string) {
        const hmac = createHmac("sha512", process.env.HASH_STORY_SECRET);

        hmac.update(dataToHash);

        return hmac.digest("hex");
    }
}
