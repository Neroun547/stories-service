import { Injectable } from "@nestjs/common";
import { createHmac } from "crypto";

@Injectable()
export class CommonService {
    generateRandomHash(dataToHash: string, hashSecret: string) {
        const hmac = createHmac("sha512", hashSecret);

        hmac.update(dataToHash);

        return hmac.digest("hex");
    }
}
