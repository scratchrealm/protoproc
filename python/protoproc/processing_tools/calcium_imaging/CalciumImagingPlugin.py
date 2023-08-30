from protoproc import ProtoprocPluginContext, ProtoprocPlugin
from ...ProtoprocPluginTypes import ProtoprocPluginContext
from .CaimanProcessingTool import CaimanProcessingTool

class CalciumImagingPlugin(ProtoprocPlugin):
    @classmethod
    def initialize(cls, context: ProtoprocPluginContext):
        context.register_processing_tool(CaimanProcessingTool)