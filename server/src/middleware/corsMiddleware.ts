import cors, { CorsOptions, CorsRequest } from "cors";


type Callback = (err: Error | null, options?: CorsOptions | undefined) => void;

var corsOptionsDelegate = function (req: CorsRequest, callback: Callback) {
    
}
export default cors(corsOptionsDelegate);
