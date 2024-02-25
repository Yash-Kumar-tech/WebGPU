import { InitGPU, CreateGPUBuffer } from "./helper";
import shader from './shader.wgsl';
import './site.css';

const CreateSquare = async () => {
    const gpu = await InitGPU();
    const device = gpu.device;

    const vertexData = new Float32Array([
        -0.5,   -0.5, //a
         0.5,   -0.5, //b
        -0.5,    0.5, //d
        -0.5,    0.5, //d
         0.5,   -0.5, //b
         0.5,    0.5, //c
    ]);

    const colorData = new Float32Array([
        1, 0, 0, //a: red
        0, 1, 0, //b: green
        1, 1, 0, //d: yellow
        1, 1, 0, //d: yellow
        0, 1, 0, //b: green
        0, 0, 1, //c: blue
    ]);

    const vertexBuffer = CreateGPUBuffer(device, vertexData);

    const colorBuffer = CreateGPUBuffer(device, colorData);

    const pipeline = device.createRenderPipeline({
        vertex: {
            module: device.createShaderModule({
                code: shader,
            }),
            entryPoint: "vs_main",
            buffers: [
                {
                    arrayStride: 2 * 4,
                    attributes: [{
                        shaderLocation: 0,
                        offset: 0,
                        format: "float32x2"
                    }]
                },
                {
                    arrayStride: 12,
                    attributes: [{
                        shaderLocation: 1,
                        offset: 0,
                        format: "float32x3"
                    }]
                }
            ]
        },
        fragment: {
            module: device.createShaderModule({
                code: shader,
            }),
            entryPoint: "fs_main",
            targets: [
                {
                    format: gpu.format as GPUTextureFormat
                }
            ]
        },
        primitive: {
            topology: "triangle-list",
        },
        layout: 'auto'
    });

    const commandEncoder = device.createCommandEncoder();
    const textureView = gpu.context.getCurrentTexture().createView();
    const renderPass = commandEncoder.beginRenderPass({
        colorAttachments: [{
            view: textureView,
            clearValue: { r: 0.2, g: 0.247, b: 0.314, a: 1.0}, //background color
            loadOp: "clear",
            storeOp: "store"
        }]
    });

    renderPass.setPipeline(pipeline);
    renderPass.setVertexBuffer(0, vertexBuffer);
    renderPass.setVertexBuffer(1, colorBuffer);
    renderPass.draw(6);
    renderPass.end();

    device.queue.submit([commandEncoder.finish()]);
}

CreateSquare();

window.addEventListener('resize', function() {
    CreateSquare();
})