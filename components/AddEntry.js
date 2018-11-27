import React, { Component } from 'react'
import { View, TouchableOpacity, Text } from 'react-native'
import { getMetricMetaInfo, timeToString, getDailyReminderValue } from '../utils/helpers'
import UdaciSlider from './UdaciSlider'
import UdaciSteppers from './UdaciSteppers'
import DateHeader from './DateHeader'
import { Ionicons } from '@expo/vector-icons'
import TextButton from './TextButton'
import { submitEntry, removeEntry } from '../utils/api'
import { connect } from 'react-redux'
import { addEntry } from '../actions'

function SubmitBtn ({ onPress }) {
    return (
      <TouchableOpacity
        onPress={onPress}>
          <Text>SUBMIT</Text>
      </TouchableOpacity>
    )
}

class AddEntry extends Component {
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
        this.props.dispatch(addEntry({
            [key]: entry
        }))
        this.setState(() => ({ run: 0, bike: 0, swim: 0, sleep: 0, eat: 0 }))
        // Navigate to home

        // Save to "DB"
        submitEntry({ key, entry })

        // Clear local notification

    }

    reset = () => {
        const key = timeToString()
        // Update Redux
        this.props.dispatch(addEntry({
            [key]: getDailyReminderValue()  //return a obj with a Prop .today
        }))
        // Route to Home
        // Update "DB"
        removeEntry(key)
    }      

    render() {
        const metaInfo = getMetricMetaInfo()
        if (this.props.alreadyLogged) {
            return (
              <View>
                <Ionicons
                    name={'md-happy'}
                    size={100}
                />
                <Text>You already logged your information for today.</Text>
                <TextButton onPress={this.reset}>
                    Reset
                </TextButton>
              </View>
            )
        }
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

function mapStateToProps (state) {
    const key = timeToString()
        return {
        alreadyLogged: state[key] && typeof state[key].today === 'undefined'
    }
}

export default connect(mapStateToProps)(AddEntry)