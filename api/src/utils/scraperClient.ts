import { Channel, ChannelWrapper } from 'amqp-connection-manager'
import { IAmqpConnectionManager } from 'amqp-connection-manager/dist/esm/AmqpConnectionManager'
import { randomUUID } from 'crypto'

export default class ScraperClient {
  private readonly _connection: IAmqpConnectionManager
  private readonly _consumeChannel: ChannelWrapper
  private readonly _queue: string
  private readonly _workQueue: string

  public constructor(amqpConnection: IAmqpConnectionManager) {
    this._connection = amqpConnection
    this._queue = ' '
    this._workQueue = 'search'
    this._consumeChannel = this._connection.createChannel({
      setup: (channel: Channel) => this._setupCommChannel(channel)
    })
  }

  private _setupCommChannel(ch: Channel) {
    return Promise.all([
      ch.setMaxListeners(0),
      ch.assertQueue(' '),
      ch.consume(this._queue, (data) => {
        if (data === null) {
          return
        }
        const response = JSON.parse(data.content.toString())
        this._consumeChannel.emit(data.properties.correlationId, response)
      })
    ])
  }

  public searchItems(keywordStr: string) {
    return new Promise((resolve, reject) => {
      const correlationId = randomUUID()
      this._consumeChannel.once(correlationId, (data) => {
        resolve(data)
      })
      this._consumeChannel
        .sendToQueue(
          this._workQueue,
          Buffer.from(JSON.stringify({ proc: 'search', keyword: keywordStr })),
          {
            correlationId: correlationId,
            replyTo: this._queue,
            timeout: 2000
          }
        )
        .catch((error) => {
          console.log('amqp error: ' + error)
          this._consumeChannel.removeAllListeners(correlationId)
          reject('Message was rejected')
        })
    })
  }

  public getDetails(keywordStr: string) {
    return new Promise((resolve, reject) => {
      const correlationId = randomUUID()
      this._consumeChannel.once(correlationId, (data) => {
        resolve(data)
      })
      this._consumeChannel
        .sendToQueue(
          this._workQueue,
          Buffer.from(JSON.stringify({ proc: 'details', keyword: keywordStr })),
          {
            correlationId: correlationId,
            replyTo: this._queue,
            timeout: 2000
          }
        )
        .catch((error) => {
          console.log('amqp error: ' + error)
          this._consumeChannel.removeAllListeners(correlationId)
          reject('Message was rejected')
        })
    })
  }
}
