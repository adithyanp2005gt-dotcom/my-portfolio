import asyncio
from typing import Type, Callable, Any, Coroutine

class Event:
    pass

# Signature type definition for asynchronous listener callables
ListenerType = Callable[[Any], Coroutine[Any, Any, None]]

class EventDispatcher:
    def __init__(self):
        self._listeners: dict[Type[Event], list[ListenerType]] = {}

    def register(self, event_type: Type[Event], listener: ListenerType):
        if event_type not in self._listeners:
            self._listeners[event_type] = []
        self._listeners[event_type].append(listener)

    async def dispatch(self, event: Event):
        event_type = type(event)
        if event_type in self._listeners:
            # Execute all register handlers concurrently using asyncio gather
            tasks = [listener(event) for listener in self._listeners[event_type]]
            await asyncio.gather(*tasks, return_exceptions=True)

dispatcher = EventDispatcher()
