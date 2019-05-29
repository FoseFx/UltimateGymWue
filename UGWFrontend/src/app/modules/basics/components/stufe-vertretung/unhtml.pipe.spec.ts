import { UnhtmlPipe } from './unhtml.pipe';

describe('UnhtmlPipe', () => {
  it('create an instance', () => {
    const pipe = new UnhtmlPipe();
    expect(pipe).toBeTruthy();
  });
  it('should remove all HTML tags', () => {
    const pipe = new UnhtmlPipe();
    expect(pipe.transform('<i><b>Some ?5_Üü$</b></i>')).toEqual('Some ?5_Üü$');
  });
  it('should remove comments', () => {
    const pipe = new UnhtmlPipe();
    expect(pipe.transform('<b>Some ?5_Üü$<!-- Some Nice Comment --></b>')).toEqual('Some ?5_Üü$');
  });

});
