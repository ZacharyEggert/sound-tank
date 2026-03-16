export enum LogLevel {
	ERROR = '0',
	WARN = '1',
	INFO = '2',
	DEBUG = '3',
	TRACE = '4',
}

export default class Logger {
	
	static log(message: string, ...args: any[]) {
		if(!process.env.SOUNDTANK_LOG_LEVEL || LogLevel[process.env.SOUNDTANK_LOG_LEVEL as keyof typeof LogLevel] < LogLevel.DEBUG) {
			return;
		}
		console.log(`[Reverb API Client] ${message}`, ...args);
	}

	static error(message: string, ...args: any[]) {
		if(!process.env.SOUNDTANK_LOG_LEVEL || LogLevel[process.env.SOUNDTANK_LOG_LEVEL as keyof typeof LogLevel] < LogLevel.ERROR) {
			return;
		}
		console.error(`[Reverb API Client] ${message}`, ...args);
	}

	static warn(message: string, ...args: any[]) {
		if(!process.env.SOUNDTANK_LOG_LEVEL || LogLevel[process.env.SOUNDTANK_LOG_LEVEL as keyof typeof LogLevel] < LogLevel.WARN) {
			return;
		}
		console.warn(`[Reverb API Client] ${message}`, ...args);
	}

	static info(message: string, ...args: any[]) {
		if(!process.env.SOUNDTANK_LOG_LEVEL || LogLevel[process.env.SOUNDTANK_LOG_LEVEL as keyof typeof LogLevel] < LogLevel.INFO) {
			return;
		}
		console.info(`[Reverb API Client] ${message}`, ...args);
	}

	static debug(message: string, ...args: any[]) {
		if(!process.env.SOUNDTANK_LOG_LEVEL || LogLevel[process.env.SOUNDTANK_LOG_LEVEL as keyof typeof LogLevel] < LogLevel.DEBUG) {
			return;
		}
		console.debug(`[Reverb API Client] ${message}`, ...args);
	}

	static trace(message: string, ...args: any[]) {
		if(!process.env.SOUNDTANK_LOG_LEVEL || LogLevel[process.env.SOUNDTANK_LOG_LEVEL as keyof typeof LogLevel] < LogLevel.TRACE) {
			return;
		}
		console.trace(`[Reverb API Client] ${message}`, ...args);
	}

	static group(level: LogLevel, message: string, ...args: any[]) {
		if(!process.env.SOUNDTANK_LOG_LEVEL || LogLevel[process.env.SOUNDTANK_LOG_LEVEL as keyof typeof LogLevel] < level) {
			return;
		}

		console.group(`[Reverb API Client] ${message}`, ...args);
	}

	static groupEnd(level: LogLevel) {
		if(!process.env.SOUNDTANK_LOG_LEVEL || LogLevel[process.env.SOUNDTANK_LOG_LEVEL as keyof typeof LogLevel] < level) {
			return;
		}

		console.groupEnd();
	}

	static time(level: LogLevel, label: string) {
		if(!process.env.SOUNDTANK_LOG_LEVEL || LogLevel[process.env.SOUNDTANK_LOG_LEVEL as keyof typeof LogLevel] < level) {
			return;
		}

		console.time(`[Reverb API Client] ${label}`);
	}

	static timeEnd(level: LogLevel, label: string) {
		if(!process.env.SOUNDTANK_LOG_LEVEL || LogLevel[process.env.SOUNDTANK_LOG_LEVEL as keyof typeof LogLevel] < level) {
			return;
		}

		console.timeEnd(`[Reverb API Client] ${label}`);
	}

	static assert(condition: any, message: string, ...args: any[]) {
		if(!process.env.SOUNDTANK_LOG_LEVEL || LogLevel[process.env.SOUNDTANK_LOG_LEVEL as keyof typeof LogLevel] < LogLevel.ERROR) {
			return;
		}
		console.assert(condition, `[Reverb API Client] ${message}`, ...args);
	}

	static clear(level: LogLevel) {
		if(!process.env.SOUNDTANK_LOG_LEVEL || LogLevel[process.env.SOUNDTANK_LOG_LEVEL as keyof typeof LogLevel] < level) {
			return;
		}
		console.clear();
	}

	static count(level: LogLevel, label: string) {
		if(!process.env.SOUNDTANK_LOG_LEVEL || LogLevel[process.env.SOUNDTANK_LOG_LEVEL as keyof typeof LogLevel] < level) {
			return;
		}
		console.count(`[Reverb API Client] ${label}`);
	}

	static countReset(level: LogLevel, label: string) {
		if(!process.env.SOUNDTANK_LOG_LEVEL || LogLevel[process.env.SOUNDTANK_LOG_LEVEL as keyof typeof LogLevel] < level) {
			return;
		}
		console.countReset(`[Reverb API Client] ${label}`);
	}

	static dir(level: LogLevel, object: any) {
		if(!process.env.SOUNDTANK_LOG_LEVEL || LogLevel[process.env.SOUNDTANK_LOG_LEVEL as keyof typeof LogLevel] < level) {
			return;
		}
		console.dir(object);
	}

	static table(level: LogLevel, data: any) {
		if(!process.env.SOUNDTANK_LOG_LEVEL || LogLevel[process.env.SOUNDTANK_LOG_LEVEL as keyof typeof LogLevel] < level) {
			return;
		}
		console.table(data);
	}

	static groupCollapsed(level: LogLevel, message: string, ...args: any[]) {
		if(!process.env.SOUNDTANK_LOG_LEVEL || LogLevel[process.env.SOUNDTANK_LOG_LEVEL as keyof typeof LogLevel] < level) {
			return;
		}
		console.groupCollapsed(`[Reverb API Client] ${message}`, ...args);
	}
}
