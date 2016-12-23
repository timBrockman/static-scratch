var expect = chai.expect;
var tests = ()=>{return true;};
describe('tests', ()=>{
  it('should return true',()=>{
    expect(tests()).to.equal(true);
  });
});
