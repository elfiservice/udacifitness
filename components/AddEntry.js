import React, { Component } from 'react'
import { View, TouchableOpacity, Text } from 'react-native'
import { getMetricMetaInfo, timeToString } from '../utils/helpers'
import UdaciSlider from './UdaciSlider'
import UdaciSteppers from './UdaciSteppers'
import DateHeader from './DateHeader'

function SubmitBtn ({ onPress }) {
    return (
      <TouchableOpacity
        onPress={onPress}>
          <Text>SUBMIT</Text>
      </TouchableOpacity>
    )
}

 export default class AddEntry extends Component {
    state = {
        run: 0,
        bike: 0,
        swim: 0,
        sleep: 0,
        eat: 0,
      }

      increment = (metric) => {
        const { max, step } = getMetricMetaInfo(metric)
        this.setState((state) => {
            const count = state[metric] + step
            return {
                ...state,
                [metric]: count > max ? max : count,
            }
        })
      }

      decrement = (metric) => {
        this.setState((state) => {
            const { step } = getMetricMetaInfo(metric)
            const count = state[metric] - step
            return {
                ...state,
                [metric]: count < 0 ? 0 : count,
            }
        })
      }

      slide = (metric, value) => {
        this.setState(() => ({
            [metric]: value
        }))
      }

      submit = () => {
        const key = timeToString()
        const entry = this.state
         // Update Redux
         this.setState(() => ({ run: 0, bike: 0, swim: 0, sleep: 0, eat: 0 }))
         // Navigate to home

         // Save to "DB"

         // Clear local notification

      }

    render() {
        const metaInfo = getMetricMetaInfo()
        return (
            <View>
                <DateHeader date={(new Date()).toLocaleDateString()} />
                {Object.keys(metaInfo).map( metric => {
                    const { getIcon, type, ...rest } = metaInfo[metric]
                    const value = this.state[metric]
                    return (
                        <View key={metric}>
                            {getIcon()}
                            {type === 'slider'
                                ? <UdaciSlider
                                    value={value}
                                    onChange={(value) => this.slide(metric, value)}
                                    {...rest}
                                />
                                : <UdaciSteppers
                                    value={value}
                                    onIncrement={() => this.increment(metric)}
                                    onDecrement={() => this.decrement(metric)}
                                    {...rest}
                                />}
                        </View>
                    )
                })}
                <SubmitBtn onPress={this.submit} />
            </View>
        )
    }
} 