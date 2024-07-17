import { ChromeMemoryService } from '../services/ChromeMemoryService.js';
import { FILE_CONSTANTS } from './constants.js';
import { errorLogMessageFormatter } from './sharedUtility.js';

export class SystemMemory {
    constructor() {
        this.loggingMessages = FILE_CONSTANTS.SYSTEM_MEMORY_CLASS.LOGGING_MESSAGES;
    }

    /**
     * Fetches System memory data using Chrome service.
     * Converts from Bytes to MB and returns object 
     * @returns {totalMemory, availableMemory, usedMemory} - Resolves with the fetched data.
     */
    async getSystemMemoryInfo() {
        try {
            const memoryData = await ChromeMemoryService.getSystemMemoryInfo();
            const totalMemory = memoryData.capacity > 0 ? (memoryData.capacity / Math.pow(1024, 3)).toFixed(2) : 0;
            const availableMemory = memoryData.availableCapacity > 0 ? (memoryData.availableCapacity / Math.pow(1024, 3)).toFixed(2) : 0;
            const usedMemory = (totalMemory - availableMemory).toFixed(2);
            const computedData = {
                totalMemory: totalMemory < 0.05 ? (totalMemory * 1024) + " MB": totalMemory + " GB",
                availableMemory: availableMemory < 0.05 ? (availableMemory * 1024) + " MB": availableMemory + " GB",
                usedMemory: usedMemory < 0.05 ? (usedMemory * 1024) + " MB": usedMemory + " GB"
            }
            return computedData
        } catch (error) {
            // console.error(errorLogMessageFormatter(this.loggingMessages.FILE_NAME, 'getSystemMemoryInfo'), error);
            throw error;
        }
    }
}