import logger, { Logger } from 'pino';
import { PlayerStats, CallRCPDParams } from '../interfaces/rcpdinterfaces'

class RCPDService {
  private rcpdUrl: string
  private logger: Logger

  constructor() {
    if (!process.env.RCPD_URL) {
      throw TypeError("Invalid RCPD_URL in Process ENV")
    }
    this.rcpdUrl = process.env.RCPD_URL
    this.logger = logger({
      level: process.env.LOG_LEVEL || 'debug',

    })
  }

  async getPlayerStats(userSteamIds: string[]): Promise<PlayerStats[]> {
    try {
      const stats = await this.callrcpd<PlayerStats[]>({
        path: '/playerStats/get',
        method: "GET",
        queryParams: userSteamIds.join(',')
      })
      return stats;
    } catch(e: unknown) {
      this.logger.error(e)
      throw Error("Unable to Get User info from RCPD")
    }
  }

  private async callrcpd<T>(params: CallRCPDParams): Promise<T> {
    const response = await fetch(`${this.rcpdUrl}/${params.path}${params.queryParams ? `?=${params.queryParams}` : ''}`, {
      headers: {
        'Content-Type': 'application/json'
      },
      method: params.method,
      body: params.body
    });

    if(!response.ok) {
      throw new Error("Error making call to RCPD")
    }

    const data = await response.json() as T
    this.logger.debug(data)

    return data;
  };
}

export default RCPDService