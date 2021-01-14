export const MedicationInstruction = {

    HTTP_METHOD_POST: 'POST',
    READ_URL: '/patients/current/healthitems',
    SHOW_PAGINATION: true,
    PAGE_SIZE: 5,
    PAGE_NUMBER: 0,

    HEALTH_MEDICATION: 'HEALTH_MEDICATION',
    MEDICATION: 'medications',

    MEDICATION_INSTRUCTIONS_SUMMARY: [
        {
            "description": Liferay.Language.get('patient.medication.label'),
            "inst": ["medication", "ihrTerm"],
            "SDC": true,
            linkable: {
                type: "portlet",
                portletNamespace: 'portletName',
                "params": [
                    {"name": "objectId", "inst": ["objectId"]},
                    {"name": 'pageSelection', "value": "detail"}

                ]
            },
            isSortable: ""
        },
        {
            "description": Liferay.Language.get('patient.medication.lastFillDate.label'),
            "inst": ["lastFillDate"],
            "format": {
                "valueType": "date"
            },
        },
        {
            "description": Liferay.Language.get('patient.medication.status.label'),
            "inst": ["medicationStatus", "ihrTerm"],
            isSortable: ""
        },
        {
            "description": Liferay.Language.get('patient.medication.indication.label'),
            "inst": ["RelatedConditionLinkage", "0", "term"],
            isSortable: ""
        },
        {
            "description": Liferay.Language.get('patient.medication.orderingProvider.label'),
            inst: ['orderingProvider', 'orderingProviderName'],
            isSortable: ""
        },
        {
            "description": Liferay.Language.get('patient.medication.dataSource.label'),
            "inst": ["dataSource"],
            "format": {
                "valueType": "dataSource"
            }
        },
        {
            "description": Liferay.Language.get('patient.medication.lastIHRUpdate.label'),
            "inst": ["lastUpdateDate"],
            "format": {
                "valueType": "date"
            }
        }
    ],

    MEDICATION_INSTRUCTIONS: [

        {
            "description": Liferay.Language.get('patient.medication.label'),
            "inst": ["medication", "ihrTerm"],
            "SDC": true,
            linkable: {
                type: "portlet",
                portletNamespace: 'portletName',
                "params": [
                    {"name": "objectId", "inst": ["objectId"]},
                    {"name": 'pageSelection', "value": "detail"}

                ]
            },
            isSortable: ""
        },
        {
            "description": Liferay.Language.get('patient.medication.lastFillDate.label'),
            "inst": ["orderDate"],
            "format": {
                "valueType": "date"
            },
        },
        {
            "description": Liferay.Language.get('patient.medication.dataSource.label'),
            "inst": ["dataSource"],
            "format": {
                "valueType": "dataSource"
            }
        }

    ],
    HEALTH_MEDICATION_DETAIL: {
        HEADER: {
            FIRST_ROW_HEADER: [
                {
                    "description": Liferay.Language.get('patient.medication.label'),
                    "inst": ["medication", "ihrTerm"]
                }
            ],
            SECOND_ROW_HEADER: [
                {
                    "description": Liferay.Language.get('patient.sourceVocabulary.label'),
                    "inst": ["medication", "sourceVocabulary"],
                    render: value => {
                         try {
                            if (value && !Array.isArray(value)) {
                                return value.replace('Foreign Key', '');
                            }
                        } catch (e) {
                        }
                        return value;
                    }
                },
                {
                    "description": Liferay.Language.get('patient.sourceVocabularyCode.label'),
                    "inst": ["medication", "sourceVocabularyCode"]
                }
            ],
            THIRD_ROW_HEADER: [
                {
                    "description": Liferay.Language.get('patient.medication.lastFillDate.label'),
                    "inst": ["lastFillDate"],
                    "format": {
                        "valueType": "date"
                    },
                }, {
                    description: Liferay.Language.get('patient.medication.life.cycle.status.label'),
                    inst: ['medicationStatus', 'ihrLaymanTerm']
                },
                {
                    "description": Liferay.Language.get('patient.medication.dataSource.label'),
                    "inst": ["dataSource"],
                    "format": {
                        "valueType": "dataSource"
                    }
                },
                {
                    "description": Liferay.Language.get('patient.medication.lastIHRUpdate.label'),
                    "inst": ["lastUpdateDate"],
                    "format": {
                        "valueType": "date"
                    }
                }
            ]
        },
        FIRST_COLUMNS: {
            Product_Information: Liferay.Language.get('patient.medication.ProductInformation.label'),
            PRODUCT_INFORMATION_SIMPLE_INSTRUCTION: [
                {
                    description: Liferay.Language.get('patient.medication.Rx.Id.label'),
                    inst: ["prescriptionId"],
                    format: {
                        valueType: "array"
                    }
                }, {
                    description: Liferay.Language.get('patient.medication.prescriber.label'),
                    inst: ['orderingProvider', 'orderingProviderName']
                },
                {
                    description: Liferay.Language.get('patient.medication.medication.start.date.label'),
                    inst: ['medicationStartDate'],
                    "format": {
                        valueType: 'date'
                    },
                },
                {
                    description: Liferay.Language.get('patient.detail.additional.info.place.of.service.label'),
                    inst: ['tbd']
                },
                {
                    description: Liferay.Language.get('patient.medication.supplier.label'),
                    "inst": ["supplier", "name"],
                }, {
                    description: Liferay.Language.get('patient.medication.role.label'),
                    inst: ['tbd']
                }, {
                    description: Liferay.Language.get('patient.medication.life.cycle.status.label'),
                    inst: ['medicationStatus', 'ihrLaymanTerm']
                }, {
                    description: Liferay.Language.get('patient.medication.last.filled.date.label'),
                    inst: ['lastFillDate'],

                    format: {
                        valueType: 'date'
                    }
                },
                {
                    description: Liferay.Language.get('patient.medication.medication.expected.fill.date.label'),
                    inst: ['expectedFillDate'],
                    "format": {
                        valueType: 'date'
                    },
                },
                {
                    description: Liferay.Language.get('patient.medication.order.date.label'),
                    inst: ['orderDate'],
                    "format": {
                        valueType: 'date'
                    },
                }, {
                    description: Liferay.Language.get('patient.medication.quantity.label'),
                    complex: {
                        inst: [
                            {
                                description: "dispensedQuantity",
                                inst: ['dispensedQuantity']
                            },
                            {
                                description: "dispensedQuantityUnit",
                                inst: ["dispensedQuantityUnit", "ihrTerm"],
                            }
                        ],
                        render: (v) => {
                            console.log("Display - Complex Value instruction= ", v);

                            if (v && typeof v === 'object' && $.isArray(v)) {
                                return v[0] + (v[1] ? ' ' + v[1] : '');
                            }
                        }
                    }

                },
                {
                    description: Liferay.Language.get('patient.medication.dosage.form.label'),
                    inst: ['dosageForm','ihrTerm']
                },
                {
                    description: Liferay.Language.get('patient.medication.dosage.frequency.label'),
                    inst: ['dosageFrequency']
                },
                {
                    description: Liferay.Language.get('patient.medication.dispensed.quantity.label'),
                    inst: ['dispensedQuantity'],
                    render: value => value ? value.toString() : ""
                },
                {
                    description: Liferay.Language.get('patient.medication.days.supply.label'),
                    inst: ['daysSupply'],
                    render: value => value ? value.toString() : ""
                },
                {
                    description: Liferay.Language.get('patient.medication.estimated.days.supply.label'),
                    inst: ['tbd']
                }, {
                    description: Liferay.Language.get('patient.medication.number.of.refills.authorized.label'),
                    inst: ['refillAuthorizedNumber'],
                    render: value => value ? value.toString() : ""
                }, {
                    description: Liferay.Language.get('patient.medication.refills.count.label'),
                    inst: ['refillCount'],
                    render: value => value ? value.toString() : ""
                },
                {
                    description: Liferay.Language.get('patient.medication.administration.instructions.label'),
                    inst: ['tbd']
                },


            ],
        },
        SECOND_COLUMNS_DETAILS: {
            EDUCATION_NOTE: {
                EducationNote: Liferay.Language.get('patient.medication.EducationNote.label'),
                INSTRUCTIONS: [
                    {
                        description: Liferay.Language.get('patient.medication.Rx.Id.label'),
                        inst: ["mediSpan", 'educationNote']
                    }
                ]
            },
            ADDITIONAL_INFO: {
                title: Liferay.Language.get('patient.detail.additional.info.title.label'),
                INSTRUCTIONS: [
                    {
                        description: Liferay.Language.get('patient.detail.additional.info.rx.otc.label'),
                        inst: ['tbd']
                    },

                    {
                        description: Liferay.Language.get('patient.detail.additional.info.prescription.origin.method.label'),
                        inst: ['tbd']
                    },
                    {
                        description: Liferay.Language.get('patient.detail.additional.info.product.substitution.reason.label'),
                        inst: ['tbd']
                    },
                    {
                        description: Liferay.Language.get('patient.detail.additional.info.medication.compound.indicator.label'),
                        inst: ['tbd']
                    },
                    {
                        description: Liferay.Language.get('patient.detail.additional.info.formula.status.label'),
                        inst: ['tbd']
                    }, {
                        description: Liferay.Language.get('patient.detail.additional.info.dea.schedule.label'),
                        inst: ['deaSchedule']
                    },
                    {
                        description: Liferay.Language.get('patient.detail.additional.info.maintenance.medication.indicator.label'),
                        inst: ['tbd']
                    },
                    {
                        description: Liferay.Language.get('patient.detail.additional.info.generic.label'),
                        inst: ['genericDrugName']
                    },
                    {
                        description: Liferay.Language.get('patient.detail.additional.info.brand.status.label'),
                        complex: {
                            inst: [
                                {
                                    description: Liferay.Language.get('patient.detail.additional.info.brand.status.label'),
                                    inst: ['genericFlag']
                                }
                            ]    ,
                            render: (v) => {
                                console.log("Display - Complex Value instruction= ", v);

                                if (v && typeof v === 'object' && $.isArray(v) && v[0]===true) {
                                    return Liferay.Language.get('patient.detail.additional.info.generic.med.label');
                                } else {
                                    return '';
                                }
                            }
                        }
                    },
                    {
                        description: Liferay.Language.get('patient.detail.additional.info.drug.class.label'),
                        inst: ['drugClass'],
                        format: {
                            valueType: "array"
                        }
                    },
                    {
                        description: Liferay.Language.get('patient.detail.additional.info.manufacturer.label'),
                        inst: ['tbd']

                    }

                    /*,
                    {
                        description: Liferay.Language.get('patient.detail.additional.info.product.half.indicator.label'),
                        inst: ['tbd']
                    },*/


                ]
            }
        },
        THIRD_COLUMNS_DETAILS: {
            RELATED_CONDITION: {
                RelatedCondition: Liferay.Language.get('patient.medication.detail.related.condition.label'),
                INSTRUCTIONS: [
                    {
                        description: Liferay.Language.get('patient.medication.detail.term.label'),
                        inst: ["term"]
                    },
                    {
                        description: Liferay.Language.get('patient.medication.detail.onset.label'),
                        inst: ["onsetDate"],
                        "format": {
                            "valueType": "date"
                        },
                    }

                ]
            }
        }
    }
};
