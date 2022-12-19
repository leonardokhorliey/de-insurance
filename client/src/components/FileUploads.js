import { useState, useEffect, useContext } from 'react';
import { FaTrash } from 'react-icons/fa'
import { AppContext } from '../context';
import uploadToIpfs from '../helpers/moralis';

const FileUploads = ({setUploadedDocsURI, packageType, page}) => {
    const [images, setImages] = useState([]);
    const [valuation, setValuation] = useState()
    const [ipfsObject, setipfsObject] = useState({
        name: "",
        identity: "",
        image: "",
        supportingDocs: [
        ]
    });

    const [lastDocId, setLastDocId] = useState(1);
    const [docs, setDocs] = useState([{
        id: 1,
        description: "",
        image: ""
    }])

    const { selectedAccount } = useContext(AppContext)

    // const pageMapping = {
    //     'verifier': 'registerAsVerifier',
    //     'register': 'registerForInsurance',
    //     'claim': 'makeClaim'
    // }

    const updateDocs = (id, newValue, key) => {
        const copyOfDocs = JSON.parse(JSON.stringify(docs));
        const docToBeUpdated = copyOfDocs.filter(doc => doc.id === id)[0];
        docToBeUpdated[key] = newValue;

        setDocs(copyOfDocs);
    }

    const addNewDocument = () => {
        

        const newId = lastDocId + 1;


        setDocs(prev => [
            ...prev, {
                id: newId,
                description: "",
                image: ""
            }
        ])

        setLastDocId(newId);
    }

    const removeDocument = (id) => {
        if (docs.length === 1) return;

        setDocs(prev => prev.filter(item => item.id !== id))
        setImages(prev => prev.filter(item => item.id !== id))
    }

    const uploadImagestoIpfs = async () => {

        
        // images.forEach(img => {
        //     let content = {} ;
        //     content.path= `${img.file.name}.json`;
        //     content.content = img.file;
        //     files.push(content);
        // }) 

        const files = images.map(img => ({
            path: `${img.file.name}.json`,
            content : img.file
        }))

        console.log(files);

        

        const data = await uploadToIpfs(files);
        return data;
    }

    const uploadDocsURI = async () => {
        const uploadedImgs = await uploadImagestoIpfs();
        
        console.log(uploadedImgs);
        let data;
        uploadedImgs.forEach(async (item, idx) => {
            if (idx === 0) {
                setipfsObject(prev => {return {...prev, image: item.path}});
                return;
            }

            // supportingDocs = ipfsObject.supportingDocs

            setipfsObject(prev => {
                let supportingDocs = [...prev.supportingDocs, {
                    id: idx,
                    description: docs[idx - 1].description,
                    image: item.path
                }];

                prev.supportingDocs = supportingDocs;

                console.log(prev);

                return prev;
            });

            if (idx === uploadedImgs.length - 1) {

                setTimeout(async () => {
                    console.log(ipfsObject);
                    data = await uploadToIpfs([{path: `${selectedAccount.substring(0, 10)}-${page=== 'verifier' ? 'verifier' : packageType}.json`, 
                        content: ipfsObject}]
                    );
                    
                    console.log(data[0].path);
                    setUploadedDocsURI(data[0].path, valuation);
                }, 4000);
                

            }

            

        })

    }




    return (
        <section id="package-enroll-area">

            <div>
                <h2>
                    {page === 'verifier' ? 'Enroll as a Verifier Today' : 'Enroll for this package today'}
                </h2>
                {page === 'verifier'  && <p>
                    Make a contribution to the pool and get annual rewards for your verification activities
                </p>}
                <div class="register-form">
                    <div class="form-area">
                        <label>Enter Item Name</label>
                        <input type="text" value={ipfsObject.name} onChange={(e) => setipfsObject(prev => {return {...prev, name: e.target.value}})}/>
                    </div>
                    
                    <div class="form-area">
                        <label>Enter a unique identity info</label>
                        <input type="text" value={ipfsObject.identity} onChange={(e) => setipfsObject(prev => {return {...prev, identity: e.target.value}})}/>
                    </div>

                    <div class="form-area">
                        <label>
                            Upload an image of item
                        </label>
                        <input type="file" name="image"  onChange={(e) => {
								setImages(prev => [...prev, {id: -1, name: e.target.files[0].name, file: e.target.files[0]}]);
							}}/>
                    </div>
                    <div class="form-area">
                        <label>
                            Propose Valuation in USDT
                        </label>
                        <input type="text" value={valuation} onChange={(e) => {
								setValuation(e.target.value);
							}}/>
                    </div>

                </div>
                <div class="register-form">
                        <h3>Documents</h3>
                        {
                            docs.map((ele, idx) => 
                                <div class= "doc-upload" key={idx}>
                                    <div class="doc-identity">
                                        <h3>Document</h3>
                                        <button onClick={() => removeDocument(ele.id)}>
                                            <FaTrash />
                                        </button>
                                    </div>
                                    

                                    <div class="form-area">
                                        <label>Enter file description</label>
                                        <input type="text" value={ele.description} 
                                        onChange={(e) => updateDocs(ele.id, e.target.value, 'description')}
                                        />
                                    </div>
                                    
                                    <div class="form-area"> 
                                        <label>Upload file</label>
                                        <input type="file" 
                                        
                                        onChange={(e) => {
                                            setImages(prev => [...prev, {id: ele.id, name: e.target.files[0].name, file: e.target.files[0]}]);
                                        }}
                                        />
                                    </div>

                                    
                                </div>
                            )
                        }

                        <button style={{width: '300px'}} onClick={() => addNewDocument()}>
                            Add another Document
                        </button>
                </div>

                <button style={{width: '400px', marginTop: '100px'}} onClick= {() => uploadDocsURI()}>
                    {page === 'verifier' ? 'Register as verifier' : 'Register for package'}
                </button>
            </div>

        </section>
    )
}


export default FileUploads;