from protoproc import ProtoprocPluginContext, ProtoprocPlugin
from ...ProtoprocPluginTypes import ProtoprocPluginContext
from .Kilosort2p5ProcessingTool import Kilosort2p5ProcessingTool
from .Kilosort3ProcessingTool import Kilosort3ProcessingTool
from .Mountainsort5ProcessingTool import Mountainsort5ProcessingTool

class SpikeSortingPlugin(ProtoprocPlugin):
    @classmethod
    def initialize(cls, context: ProtoprocPluginContext):
        context.register_processing_tool(Kilosort2p5ProcessingTool)
        context.register_processing_tool(Kilosort3ProcessingTool)
        context.register_processing_tool(Mountainsort5ProcessingTool)