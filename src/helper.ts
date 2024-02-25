export const CreateGPUBuffer = 
    (
        device: GPUDevice, 
        data: Float32Array, 
        usageFlag: GPUBufferUsageFlags = GPUBufferUsage.VERTEX | GPUBufferUsage.COPY_DST
    ) => {
        const buffer = device.createBuffer({
            size: data.byteLength,
            usage: usageFlag,
            mappedAtCreation: true,
        });

        new Float32Array(buffer.getMappedRange()).set(data);
        buffer.unmap();
        return buffer;
}

export const InitGPU = async () => {
    const checkgpu = CheckWebGPU();
    if(checkgpu.includes("Your current browser does not support WebGPU!")) {
        console.log(checkgpu);
        throw("Your current browser does not support WebGPU!");
    }

    const canvas = document.getElementById("canvas-webgpu") as HTMLCanvasElement;
    const adapter = await navigator.gpu?.requestAdapter();
    const device = await adapter?.requestDevice() as GPUDevice;
    const context = canvas.getContext("webgpu") as GPUCanvasContext;

    const devicePixelRatio = window.devicePixelRatio || 1;

    const format = navigator.gpu.getPreferredCanvasFormat();

    context.configure({
        device: device,
        format: format
    });

    return { device, canvas, format, context };

}

export const CheckWebGPU = () => {
    let result = "Great, your browser supports WebGPU!";
    if (!navigator.gpu) {
        result = `Your current browser does not support WebGPU! Make sure you are on a system 
                with WebGPU enabled. Currently, WebGPU is supported in  
                <a href="https://www.google.com/chrome/canary/">Chrome canary</a>
                with the flag "enable-unsafe-webgpu" enabled. See the 
                <a href="https://github.com/gpuweb/gpuweb/wiki/Implementation-Status"> 
                Implementation Status</a> page for more details.   
                You can also use your regular Chrome to try a pre-release version of WebGPU via
                <a href="https://developer.chrome.com/origintrials/#/view_trial/118219490218475521">Origin Trial</a>.                
            `;
    }

    const canvas = document.getElementById("canvas") as HTMLCanvasElement;

    if(canvas) {
        const div = document.getElementsByClassName('item2')[0] as HTMLDivElement;
        canvas.width = div.offsetWidth;
        canvas.height = div.offsetHeight;

        function windowResize() {
            canvas.width = div.offsetWidth;
            canvas.height = div.offsetHeight;
        };

        window.addEventListener('resize', windowResize);
    }

    return result;
}