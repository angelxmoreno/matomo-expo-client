import {expect} from 'chai';
import Utility from "../../dist/Utility";

describe('Utility Class', function () {
    it('returns screen resolution', function () {
        const resolution = Utility.getResolution();
        
        expect(resolution).to.be.a('string')
    })
})
