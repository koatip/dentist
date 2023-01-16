export default function validation(serviceList) {

    const validators = {
        fullName: [
            {
                fn: isNotEmpty,
                errorMessage: 'Kitöltése kötelező'
            }
        ],
        email: [
            {
                fn: isNotEmpty,
                errorMessage: 'Kitöltése kötelező'
            },
            {
              fn: isValidEmail,
              errorMessage: 'Nem megfelelő email cím formátum'
            }
        ],
        service: [
            {
                fn: isValidService,
                errorMessage: 'Választani kötelező'
            }
        ],
        appointment: [
          {
              fn: isNotEmpty,
              errorMessage: 'Kitöltése kötelező'
          },
          {
            fn: isValidDate,
            errorMessage: 'Nem megfelelő dátum'
          }
      ],
        
    }

    function isNotEmpty(value) {
        return value !== ''
    }
    
    function isValidEmail(value) {
      const regex = /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/
      return regex.test(value)
    }

    function isValidService(value) {
      return serviceList.includes(value)
    }

    function isValidDate(value) {
      const today = new Date();
      let tomorrow = today.setDate(today.getDate() + 1);
      tomorrow = new Date(tomorrow).toISOString();
      return value.split('T')[0] >= tomorrow.split('T')[0];
    }

    function reportFieldValidity(inputName, inputValue, setErrorMessages) {
        const inputValidators = validators[inputName]
        const inputValidationResults = inputValidators
            .map(inputValidator => {
                const { fn: validatorFn, errorMessage: validatorErrorMessage } = inputValidator
                const isValid = validatorFn(inputValue)
                return isValid ? '' : validatorErrorMessage
            })
            .filter(errorMessage => errorMessage !== '')

        setErrorMessages(data => ({
            ...data,
            [inputName]: inputValidationResults
        }))

        return inputValidationResults.length === 0
    }

    function reportFormValidity(formData, setErrorMessages) {
        const inputNames = Object.keys(validators)
        const inputValidations = inputNames.map(inputName => reportFieldValidity(inputName, formData[inputName], setErrorMessages))

        let isValid = inputValidations.every(isValid => isValid)

        return isValid
    }

    return reportFormValidity;
}