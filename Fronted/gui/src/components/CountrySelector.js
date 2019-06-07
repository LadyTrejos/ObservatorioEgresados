import React from 'react';
import { Select } from 'antd';
import country from 'country-state-city';


const { Option } = Select;

class CountrySelector extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            country: '',
            state: '',
            city: '',
            phonecodes: []
        }
    }

    countryData = {
		countries : [],
		states : [],
        cities : []
    }

    componentWillMount(){
        let data = country.getAllCountries();
        this.countryData.countries = data;
        
        let c = data.map((x)=>{
                return x.phonecode
        });
        this.countryData.phonecodes = [
          ...new Set(c.sort((a, b) => a-b))
        ];

        let phonecodeItems = this.countryData.phonecodes.map((item) =>
            <Option key={item}> {`+${item}`} </Option>
        );

        this.setState({
            phonecodeItems: phonecodeItems
        })
    }

    handleCountryChange = (value)=>{
		
        let Country = country.getCountryById(value)
            
            this.setState({
                  country: Country.name
            });
        
        let states = country.getStatesOfCountry(value);
            this.countryData.states = states;
      }
      
    handleStateChange = (value)=>{
        let region = country.getStateById(value)
        this.setState({
        region: region.name
    });

        let cities = country.getCitiesOfState(value);
        this.countryData.cities = cities;
    }
    
    handleCitiesChange = (value)=>{
        let city = country.getCityById(value)
        this.setState({
            city: city.name 
        });
    }

    render() {
        
        let countryItems = this.countryData.countries.map((count) =>
            <Option key={count.id}> {count.name} </Option>
        );

        let stateItems = this.countryData.states ? 
            (this.countryData.states.map((state) =>
            <Option key={state.id}> {state.name} </Option>))
            : null;

        let cityItems = this.countryData.cities ? 
            (this.countryData.cities.map((city) =>
            <Option key={city.id}> {city.name} </Option>))
            : null;

        return(
            <div>
                <Select
                    size='large'
                    placeholder='País'
                    onChange={this.handleCountryChange}
                >
                    {countryItems}
                </Select>
                <Select
                    size='large'
                    placeholder='Región'
                    onChange={this.handleStateChange}
                >
                    {stateItems}
                </Select>
                <Select
                    size='large'
                    placeholder='Ciudad'
                    onChange={this.handleCitiesChange}
                >
                    {cityItems}
                </Select>
            </div>
                  
        );
    }
}

export default CountrySelector;

