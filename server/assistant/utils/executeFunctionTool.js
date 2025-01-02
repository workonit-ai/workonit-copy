const { functionToolController } = require('./functionToolController');

exports.executeFunctionTool = async (fn, args, call_id, tool_outputs) => {
    const output = await functionToolController(
        fn,
        args
    );

    tool_outputs.push({
        tool_call_id: call_id,
        output: JSON.stringify(output)
    });
};
